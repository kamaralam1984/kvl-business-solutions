#!/bin/bash
# KVL Marketing Cron Setup Script
# Run this on VPS: bash /var/www/kvl/next-app/next-app/scripts/setup-crons.sh

PORT=3001

# Remove old KVL cron entries if any
crontab -l 2>/dev/null | grep -v "kvl\|lead-followup\|lead-nurture\|review-request" > /tmp/crontab_clean

# Add new KVL cron jobs
cat >> /tmp/crontab_clean << 'EOF'

# === KVL Marketing Automation ===
# Lead follow-up sequence (every 30 min)
*/30 * * * * curl -s "http://localhost:3001/api/cron/lead-followup?secret=kvl-cron-2024" >> /var/log/kvl-cron.log 2>&1
# Weekly AI nurture emails (Sunday 10am)
0 10 * * 0 curl -s "http://localhost:3001/api/cron/lead-nurture?secret=kvl-cron-2024" >> /var/log/kvl-cron.log 2>&1
# Daily review requests (9am)
0 9 * * * curl -s "http://localhost:3001/api/cron/review-request?secret=kvl-cron-2024" >> /var/log/kvl-cron.log 2>&1
EOF

crontab /tmp/crontab_clean
rm /tmp/crontab_clean

echo "✅ KVL cron jobs added successfully!"
echo ""
echo "Current crontab:"
crontab -l | grep -A1 "KVL"
