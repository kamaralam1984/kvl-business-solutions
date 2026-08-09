import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import { User } from './models/User';
import { rateLimit } from './rate-limit';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) return null;
      // Per-account throttle (not per-IP — NextAuth's authorize() callback doesn't
      // reliably expose the real client IP across versions/deployments) so a script
      // can't brute-force/credential-stuff a known email, admin accounts included.
      const rl = rateLimit(`login:${credentials.email.toLowerCase()}`, 10, 15 * 60_000);
      if (!rl.allowed) return null;
      await connectDB();
      const user = await User.findOne({ email: credentials.email.toLowerCase() });
      if (!user || !user.passwordHash) return null; // OAuth-only users can't use password login
      const ok = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!ok) return null;
      return { id: String(user._id), email: user.email, name: user.name, role: user.role } as any;
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }));
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        await connectDB();
        const existing = await User.findOne({ email: user.email.toLowerCase() });
        if (!existing) {
          await User.create({
            email: user.email.toLowerCase(),
            name: user.name,
            image: user.image,
            provider: 'google',
            emailVerified: true, // Google guarantees email is verified
          });
        } else if (existing.provider === 'credentials' && !existing.image && user.image) {
          // Link Google to existing credentials account — just enrich profile
          existing.image = user.image;
          existing.emailVerified = true;
          await existing.save();
        }
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        (token as any).role = (user as any).role;
        (token as any).id = (user as any).id;
        (token as any).roleCheckedAt = Date.now();
      }
      // Re-check role from the DB periodically (not just once, and not just for
      // Google sign-ins) — a JWT session otherwise keeps whatever role it was
      // issued with for its entire lifetime, so an admin demoted from the admin
      // panel would keep full access until they happened to sign in again.
      // This bounds that staleness window instead of leaving it open-ended.
      const ROLE_REFRESH_MS = 5 * 60_000;
      const lastChecked = (token as any).roleCheckedAt || 0;
      if (token.email && (!(token as any).role || Date.now() - lastChecked > ROLE_REFRESH_MS)) {
        await connectDB();
        const u = await User.findOne({ email: (token.email as string).toLowerCase() }).lean<any>();
        if (u) { (token as any).role = u.role; (token as any).id = String(u._id); }
        (token as any).roleCheckedAt = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = (token as any).role;
      (session.user as any).id = (token as any).id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
