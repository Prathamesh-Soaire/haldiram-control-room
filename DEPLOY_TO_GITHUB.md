# 🚀 Deploy to GitHub Pages

Follow these simple steps to deploy your Haldiram Control Room dashboard to GitHub Pages.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+ "** icon in the top right → **"New repository"**
3. Repository name: `haldiram-control-room` (or any name you like)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README, .gitignore, or license
6. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

Open Terminal/Command Prompt in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit: Haldiram Control Room dashboard"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/haldiram-control-room.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If this is your first time, GitHub may ask you to authenticate. Follow the prompts.

## Step 3: Deploy to GitHub Pages

Run the deploy command:

```bash
npm run deploy
```

This will:
1. Build your project
2. Deploy the `dist` folder to the `gh-pages` branch
3. Your site will be live at: `https://YOUR_USERNAME.github.io/haldiram-control-room/`

## Step 4: Enable GitHub Pages (if needed)

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **gh-pages** branch
4. Click **Save**

Your site should be live within 2-3 minutes!

## 🌐 Your Live Site

Your dashboard will be available at:
```
https://YOUR_USERNAME.github.io/haldiram-control-room/
```

## Updating Your Site

Whenever you make changes:

```bash
# Make your changes to the code

# Add and commit
git add .
git commit -m "Your commit message"

# Push changes
git push

# Deploy
npm run deploy
```

## Troubleshooting

### "repository not found"
- Check that your repository URL is correct
- Make sure you've pushed your code to GitHub first

### Site shows 404
- Wait 2-3 minutes after deploying
- Check repository Settings → Pages
- Ensure gh-pages branch is selected

### Assets not loading
- If your repo is in a subfolder, you may need to update vite.config.ts:
  ```typescript
  export default defineConfig({
    base: '/repository-name/',
    // ... rest of config
  })
  ```

### Cannot push
- Make sure you're authenticated with GitHub
- Check you have write access to the repository

## Alternative: Quick Deploy Commands

If you prefer, you can run commands individually:

```bash
# Build
npm run build

# Deploy only
npx gh-pages -d dist
```

## Next Steps

Once deployed:
- 📋 Share your live link!
- 🔒 Consider adding a custom domain
- ⚙️ Enable GitHub Actions for automatic deployment
- 🌍 Add Google Analytics if needed

---

**Need help?** Check GitHub Pages documentation: https://docs.github.com/en/pages

