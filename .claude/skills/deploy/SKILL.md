---
name: deploy
description: Deploy the KVL Business Solutions Next.js site (next-app) to the production VPS. Use when the user asks to deploy, redeploy, push live or release the website.
---

# Deploy KVL Business Solutions (next-app) to VPS

Production site: https://kvlbusinesssolutions.com (nginx -> 127.0.0.1:3003)

## Server facts
- Host: `root@187.127.148.237` (shared VPS, many other apps run here, do NOT touch them)
- App dir: `/var/www/kvl/next-app`
- Process: pm2 app **`kvl-business`** (`npm start -- -p 3003`)
- Server is NOT updated by `git pull`. Its tree has earlier file-copy deploys, so use **rsync**.
- Secrets live only on the server in `/var/www/kvl/next-app/.env.local` and `.env`. Never overwrite or print them.
- Backups go to `/root/kvl-backups/`.

## Password
The SSH password is NOT stored in this repo. Ask the user for it (or use an SSH key if one has been set up),
then export it for the session only: `export SSHPASS='<password>'` and use `sshpass -e ssh ...`.
Never write it into a file, commit, or log.

## Why build on the server
A local `npm run build` fails when the dev machine cannot resolve MongoDB (`querySrv ENOTFOUND`, pages like
`/[country]` query the DB at build time) and when Google Fonts is unreachable. The server has network, so build there.

## Steps

1. **Pre-check locally** (no network needed):
   ```bash
   cd next-app && npx tsc --noEmit
   ```
   Make sure work is committed and pushed (`git status` clean) so the deployed code matches `main`.

2. **Back up the server**:
   ```bash
   sshpass -e ssh root@187.127.148.237 'mkdir -p /root/kvl-backups && cd /var/www/kvl && tar czf /root/kvl-backups/kvl-next-app-pre-deploy-$(date +%Y%m%d-%H%M%S).tgz --exclude=node_modules --exclude=.next/cache next-app'
   ```

3. **Sync code** (no `--delete`; env files, node_modules and .next are excluded):
   ```bash
   cd next-app && sshpass -e rsync -az \
     --exclude node_modules --exclude .next --exclude '.env*' --exclude '*.bak*' \
     --exclude .git --exclude tsconfig.tsbuildinfo \
     -e "ssh -o StrictHostKeyChecking=accept-new" ./ root@187.127.148.237:/var/www/kvl/next-app/
   ```

4. **Install and build on the server**:
   ```bash
   sshpass -e ssh root@187.127.148.237 'cd /var/www/kvl/next-app && npm ci --no-audit --no-fund && NODE_OPTIONS=--max-old-space-size=3072 npm run build'
   ```
   If the build fails, stop. The running site keeps the old process in memory but do not restart; fix or roll back.

5. **Restart only this app**:
   ```bash
   sshpass -e ssh root@187.127.148.237 'pm2 restart kvl-business --update-env'
   ```

6. **Verify**:
   ```bash
   sshpass -e ssh root@187.127.148.237 'sleep 8; pm2 list | grep kvl-business; for u in / /about /india; do echo $u $(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003$u); done; curl -s -o /dev/null -w "public %{http_code}\n" https://kvlbusinesssolutions.com/; pm2 logs kvl-business --lines 15 --nostream'
   ```
   Expect 200 everywhere and no errors in the log.

## Rollback
```bash
sshpass -e ssh root@187.127.148.237 'cd /var/www/kvl && tar xzf /root/kvl-backups/<backup-file>.tgz && cd next-app && npm ci --no-audit --no-fund && npm run build && pm2 restart kvl-business'
```

## Notes
- New env vars (e.g. `OUTREACH_IMAP_*`, `OUTREACH_REPLY_TO_EMAIL`, see `.env.example`) must be added to the server's `.env.local` by hand, then `pm2 restart kvl-business --update-env`.
- Cron routes (`/api/cron/outreach-send`, `/api/cron/outreach-check-replies`) are scheduled in `vercel.json`, which only works on Vercel. On this VPS, they need a system crontab entry calling the route with `CRON_SECRET`.
