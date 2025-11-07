# How to Enable Analytics After Creating Tables

## Step 1: Run the SQL Schema in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase_analytics_schema.sql`
4. Paste and click **Run**
5. You should see "Success" messages for each table/policy created

## Step 2: Re-enable Analytics Tracking in Code

Once the tables are created, you need to uncomment the analytics code:

### File: `/src/services/comprehensiveAnalytics.ts`

Find these sections and **remove the return statement and uncomment the code**:

1. **Line ~137: `startSession()` method**
   - Remove: `return;`
   - Uncomment the code block below it

2. **Line ~178: `trackPageView()` method**
   - Remove: `return;`
   - Uncomment the code block below it

3. **Line ~238: `savePageExit()` method**
   - Remove: `return;`
   - Uncomment the code block below it

4. **Line ~309: `trackEvent()` method**
   - Remove: `return;`
   - Uncomment the code block below it

## Step 3: Test Analytics

After re-enabling:

1. Open your browser's Developer Console
2. Visit your site
3. You should see console logs like:
   - `📄 Page view tracked: /`
   - `📌 Event tracked: click`
   - `📊 Page exit saved: 15s on /`

4. Check Supabase to verify data is being inserted:
   ```sql
   -- Check sessions
   SELECT * FROM analytics_sessions ORDER BY started_at DESC LIMIT 10;

   -- Check page views
   SELECT * FROM analytics_page_views ORDER BY viewed_at DESC LIMIT 10;
   ```

## Step 4: Commit Changes

Once verified working:

```bash
git add -A
git commit -m "feat: enable Supabase analytics tracking with proper tables"
git push origin main
```

## Troubleshooting

If you still see 401/403 errors:

1. **Check RLS Policies**: Make sure the policies allow `anon` role to INSERT
2. **Check API Key**: Verify `VITE_SUPABASE_ANON_KEY` in Vercel matches your Supabase project
3. **Check Table Names**: Ensure table names match exactly (analytics_sessions, analytics_page_views, etc.)

## Analytics Dashboard

To view analytics in your admin panel:

1. Navigate to `/admin/analytics`
2. The dashboard will show:
   - Real-time visitors
   - Page views
   - Session duration
   - Traffic sources
   - Device/browser breakdown