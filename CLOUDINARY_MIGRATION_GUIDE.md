# Cloudinary Migration Guide

## Problem
Your `/public/MoStuff` folder is 1.6GB with 1,667 images, causing your Vercel deployment to fail. The dist folder is 2.1GB, exceeding Vercel's limits (100MB free tier, 4GB Pro tier for source files).

## Solution
Migrate all images to Cloudinary (which you already have configured) and update code references.

---

## Step 1: Get Your Cloudinary API Secret

1. Go to https://console.cloudinary.com/
2. Log in with your account
3. Go to **Settings** → **Security** → **Access Keys**
4. Copy your **API Secret** (different from API Key)
5. Add it to your `.env` file:

```env
# Add this line to .env
CLOUDINARY_API_SECRET=your_api_secret_here
```

6. **IMPORTANT**: Also add it to Vercel:
   - Go to https://vercel.com/your-project/settings/environment-variables
   - Add: `CLOUDINARY_API_SECRET` = `your_api_secret_here`

---

## Step 2: Run Migration Scripts

### Option A: Test with Sample Images First (Recommended)

Create a test folder with a few images:

```bash
# Create test folder
mkdir -p public/MoStuff-test
cp public/MoStuff/LandingPage/HeroPage.jpg public/MoStuff-test/
cp public/MoStuff/images/morganvideocover.jpg public/MoStuff-test/
```

Modify `migrate-to-cloudinary.mjs` temporarily:
- Change `SOURCE_DIR` from `'./public/MoStuff'` to `'./public/MoStuff-test'`

Run test migration:
```bash
node migrate-to-cloudinary.mjs
```

Verify images uploaded to Cloudinary console.

### Option B: Full Migration (1,667 images)

This will take approximately 2-3 hours due to API rate limits.

```bash
# Run migration
node migrate-to-cloudinary.mjs
```

The script will:
- Upload all 1,667 images in batches of 10
- Add 1-second delays between batches (respecting Cloudinary rate limits)
- Create `cloudinary-url-mapping.json` with path mappings
- Show progress: "📊 Progress: X uploaded, Y failed, Z remaining"

**Expected Output:**
```
🚀 Starting Cloudinary migration...
📸 Found 1667 images to upload

📤 Uploading batch 1 of 167...
✅ Uploaded: LandingPage/HeroPage.jpg -> https://res.cloudinary.com/...
✅ Uploaded: images/morganvideocover.jpg -> https://res.cloudinary.com/...
...

✅ Migration complete!
📊 Final results:
   Total images: 1667
   Successfully uploaded: 1667
   Failed: 0

💾 URL mapping saved to: ./cloudinary-url-mapping.json
```

---

## Step 3: Update Code References

After migration completes, update all code to use Cloudinary URLs:

```bash
node update-image-paths.mjs
```

This will:
- Read `cloudinary-url-mapping.json`
- Find all files in `src/` with `/MoStuff/` references
- Replace local paths with Cloudinary URLs
- Show summary of files modified

**Expected Output:**
```
✅ Updated src/pages/LandingPage.tsx (23 replacements)
✅ Updated src/data/judyMikeImages.ts (87 replacements)
...

📊 Summary:
   Files modified: 43
   Total replacements: 1,667
```

---

## Step 4: Test Locally

```bash
# Start dev server
npm run dev

# Visit these pages and verify images load:
# - http://localhost:5173/
# - http://localhost:5173/portfolio
# - http://localhost:5173/gallery/judy-mike
```

---

## Step 5: Deploy

```bash
# Commit changes
git add .
git commit -m "Migrate images to Cloudinary - reduce deployment size from 2.1GB to <100MB"

# Push to trigger deployment
git push
```

---

## Step 6: Clean Up (After Successful Deployment)

Once you verify everything works on production:

1. **Backup locally first** (copy to external drive):
```bash
cp -r public/MoStuff ~/Desktop/MoStuff-backup
```

2. **Remove from git** (saves repo space):
```bash
# Add to .gitignore
echo "public/MoStuff/" >> .gitignore

# Remove from git (keeps local copy)
git rm -r --cached public/MoStuff

# Commit
git commit -m "Remove MoStuff from repo - now served from Cloudinary"
git push
```

3. **Optional**: Delete local copy if needed:
```bash
rm -rf public/MoStuff
```

---

## Benefits

### Before Migration:
- ❌ Deployment size: 2.1GB
- ❌ Exceeds Vercel limits
- ❌ Slow deployments
- ❌ Cannot deploy to Vercel
- ❌ Large git repository

### After Migration:
- ✅ Deployment size: ~100MB
- ✅ Within Vercel limits
- ✅ Fast deployments (2-3 minutes)
- ✅ CDN-optimized images (faster loading)
- ✅ Automatic image optimization (WebP, AVIF)
- ✅ On-the-fly transformations (resize, crop, quality)
- ✅ Small git repository

---

## Troubleshooting

### Error: "CLOUDINARY_API_SECRET not found"
- Make sure you added it to `.env` file
- Restart your terminal to reload environment variables

### Error: "Too Many Requests" or "Rate Limit"
- The script has built-in rate limiting (1 second between batches)
- If you hit limits, wait a few minutes and restart the script
- It will skip already-uploaded images

### Images not showing after migration
- Check browser console for errors
- Verify images uploaded to Cloudinary console
- Check `cloudinary-url-mapping.json` has correct URLs
- Make sure code update script ran successfully

### Some images still 404
- Check if those images were in MoStuff
- Search codebase for the image name: `grep -r "ImageName.jpg" src/`
- Manually update if needed

---

## Cost Estimate

Cloudinary Free Tier:
- **Storage**: 25 GB (you need ~1.6GB) ✅
- **Bandwidth**: 25 GB/month ✅
- **Transformations**: 25,000/month ✅

You should be well within free tier limits. If you need more, Cloudinary Plus is $99/month.

---

## Need Help?

If migration fails or you see errors, check:

1. Cloudinary console: https://console.cloudinary.com/console/media_library
2. `cloudinary-url-mapping.json` file
3. Browser console for image loading errors
4. Vercel deployment logs

---

## Script Modifications for Advanced Use

### Upload to Different Folder

Edit `migrate-to-cloudinary.mjs`:
```javascript
const CLOUDINARY_FOLDER = 'hariel-xavier-photography/production-images';
```

### Change Batch Size

Edit `migrate-to-cloudinary.mjs`:
```javascript
const BATCH_SIZE = 5; // Slower but more reliable
// or
const BATCH_SIZE = 20; // Faster but may hit rate limits
```

### Skip Certain Files

Edit `migrate-to-cloudinary.mjs` in `getAllImageFiles()`:
```javascript
} else if (/\.(jpg|jpeg|png|webp)$/i.test(file) && !file.includes('thumbnail')) {
  fileList.push(filePath);
}
```

---

## Questions?

You're all set! The scripts are ready. Just need to:

1. ✅ Add `CLOUDINARY_API_SECRET` to `.env`
2. ✅ Run `node migrate-to-cloudinary.mjs`
3. ✅ Run `node update-image-paths.mjs`
4. ✅ Test locally
5. ✅ Deploy

Let me know if you need help with any step!
