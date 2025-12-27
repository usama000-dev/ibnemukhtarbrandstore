# Production Cron Setup for Email Campaigns

## Problem
The campaign scheduler (`campaignScheduler.ts`) uses `node-cron` which only works in development. In production (Vercel), you need to use **Vercel Cron** or an external service.

## Solution: Vercel Cron

### Step 1: Create Vercel Cron Configuration

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/email/campaigns/process-scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This will call the API route every 5 minutes automatically in production.

### Step 2: Update API Route for Cron

The route `/api/email/campaigns/process-scheduled/route.ts` is already set up correctly. It:
- Finds scheduled campaigns
- Sends them if due
- Updates status
- Returns results

### Step 3: Deploy to Vercel

```bash
git add vercel.json
git commit -m "Add Vercel Cron for campaign scheduler"
git push
```

Vercel will automatically detect the cron configuration and set it up.

### Step 4: Verify in Vercel Dashboard

1. Go to your Vercel project
2. Click "Settings" → "Cron Jobs"
3. You should see your cron job listed
4. Check logs to verify it's running

## Alternative: External Cron Service

If not using Vercel, you can use services like:

### 1. **Cron-job.org** (Free)
- URL: `https://www.champzones.com/api/email/campaigns/process-scheduled`
- Method: POST
- Schedule: Every 5 minutes (`*/5 * * * *`)

### 2. **EasyCron** (Free tier available)
- Same URL and method
- More reliable than cron-job.org

### 3. **GitHub Actions** (Free for public repos)

Create `.github/workflows/campaign-scheduler.yml`:

```yaml
name: Campaign Scheduler
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  process-campaigns:
    runs-on: ubuntu-latest
    steps:
      - name: Call API
        run: |
          curl -X POST https://www.champzones.com/api/email/campaigns/process-scheduled \
            -H "Content-Type: application/json"
```

## Current Setup

✅ **Development:** `node-cron` runs automatically via `instrumentation.ts`
✅ **Production:** Disabled (shows warning message)
⚠️ **Production:** You need to set up Vercel Cron or external service

## Testing

### Development
```bash
npm run dev
# Scheduler runs automatically every 5 minutes
```

### Production (Manual Test)
```bash
curl -X POST https://www.champzones.com/api/email/campaigns/process-scheduled
```

Should return:
```json
{
  "success": true,
  "message": "Processed 0 scheduled campaigns",
  "results": []
}
```

## Environment Variables

### Development (.env)
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Vercel)
```bash
# No NEXT_PUBLIC_BASE_URL needed for Vercel Cron
NODE_ENV=production
```

## Troubleshooting

### 405 Error
- **Cause:** Scheduler trying to call production URL from server
- **Fix:** Scheduler is now disabled in production

### Scheduler Not Running in Dev
- Check `instrumentation.ts` is being called
- Check console for "✅ Campaign scheduler initialized"
- Verify `NODE_ENV` is not set to 'production'

### Campaigns Not Sending
- Check Redis is running
- Check email queue worker is running
- Check campaign `scheduledAt` date is in the past
- Check campaign status is 'scheduled'
