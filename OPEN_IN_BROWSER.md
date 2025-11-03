# How to Open Your Dashboard in Browser

You have several options to view your Haldiram Control Room dashboard in a web browser:

## Option 1: Quick Preview (Recommended for Showcasing)

**This is the best way to show your dashboard!**

Just run:

```bash
npm run preview
```

This will start a web server and you'll see a URL like:
```
➜  Local:   http://localhost:4173/
```

**Copy that URL and paste it in any web browser** - Chrome, Firefox, Edge, Safari - it works everywhere!

This runs the optimized production build with all assets bundled, so it's fast and ready for showcasing.

**To stop the server:** Press `Ctrl+C` in the terminal

## Option 2: Development Server

For live development with hot-reload:

```bash
npm run dev
```

Opens at `http://localhost:3000` (or next available port)

## Option 3: Direct HTML File (For Quick Testing)

⚠️ **This won't work fully** because the app uses JavaScript modules and modern features.

If you need a standalone file, you'll need to:
1. Use the preview server (Option 1)
2. Deploy to a hosting service (see QUICK_START.md)
3. Use a local web server

## Quick Commands Reference

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Development mode
npm run dev
```

## For Sharing/Showcasing

**Best approach:** Run the preview server and share the URL:

```bash
npm run preview -- --host
```

This exposes it on your local network so others can access it by your IP address.

Or deploy to a free hosting service:
- **Vercel**: `vercel` (easiest - just run the command)
- **Netlify**: Upload the `dist` folder
- **GitHub Pages**: Use `gh-pages` package

See `QUICK_START.md` for detailed deployment instructions.

