#!/bin/bash
# KVL Marketing Cron Setup Script
# Run this on VPS: CRON_SECRET=<value from .env.local> bash /var/www/kvl/next-app/next-app/scripts/setup-crons.sh

PORT=3002

if [ -z "$CRON_SECRET" ]; then
  echo "❌ CRON_SECRET is not set. Run with: CRON_SECRET=<value from .env.local> bash scripts/setup-crons.sh"
  exit 1
fi

# Remove old KVL cron entries if any
crontab -l 2>/dev/null | grep -v "kvl\|lead-followup\|lead-nurture\|review-request\|abandoned-orders\|renewal-reminders\|workflow-triggers\|expire-coupons" > /tmp/crontab_clean

# Add new KVL cron jobs — auth via Authorization: Bearer header (matches lib/cron-auth.ts), not a query-string secret
cat >> /tmp/crontab_clean << EOF

# === KVL Marketing Automation ===
# Lead follow-up sequence (every 30 min)
*/30 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/lead-followup" >> /var/log/kvl-cron.log 2>&1
# Weekly AI nurture emails (Sunday 10am)
0 10 * * 0 curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/lead-nurture" >> /var/log/kvl-cron.log 2>&1
# Daily review requests (9am)
0 9 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/review-request" >> /var/log/kvl-cron.log 2>&1
# Abandoned checkout recovery emails (hourly — window is a sliding 24-25h band, needs frequent checks to not miss orders)
0 * * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/abandoned-orders" >> /var/log/kvl-cron.log 2>&1
# License renewal reminders, 7 days before 1-year expiry (daily 9:30am)
30 9 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/renewal-reminders" >> /var/log/kvl-cron.log 2>&1
# Time-based workflow triggers — lead_inactive_3d, cart_abandoned, etc. (daily 8am)
0 8 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/workflow-triggers" >> /var/log/kvl-cron.log 2>&1
# Deactivate expired coupons (daily midnight)
0 0 * * * curl -s -H "Authorization: Bearer $CRON_SECRET" "http://localhost:$PORT/api/cron/expire-coupons" >> /var/log/kvl-cron.log 2>&1
EOF

crontab /tmp/crontab_clean
rm /tmp/crontab_clean

echo "✅ KVL cron jobs added successfully!"
echo ""
echo "Current crontab:"
crontab -l | grep -A1 "KVL"
