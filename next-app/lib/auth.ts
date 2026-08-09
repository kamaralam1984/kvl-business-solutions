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
      }
      // For Google sign-ins, fetch role from DB since the OAuth user object doesn't have it
      if (!(token as any).role && token.email) {
        await connectDB();
        const u = await User.findOne({ email: (token.email as string).toLowerCase() }).lean<any>();
        if (u) { (token as any).role = u.role; (token as any).id = String(u._id); }
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
