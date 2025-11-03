# Quick Start Guide

## Running the Application

### Development Mode

```bash
npm run dev
```

Open your browser to `http://localhost:3000` (or the port shown in the terminal).

### Production Build

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` folder, ready for deployment.

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. From the project root, run:
```bash
vercel
```

3. Follow the prompts - Vercel will auto-detect Vite and configure everything

4. Your site will be live at `https://your-project.vercel.app`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

3. Build and deploy:
```bash
npm run build
npm run deploy
```

### Option 4: Any Static Host

1. Build the project:
```bash
npm run build
```

2. Upload the contents of the `dist/` folder to any static hosting service:
   - Firebase Hosting
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - Cloudflare Pages
   - Your own server

## Configuration for Subdirectory Deployment

If deploying to a subdirectory (e.g., `/app`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-subdirectory/',
  // ... rest of config
})
```

## Troubleshooting

### Port Already in Use

If port 3000 is busy, you can change it in `vite.config.ts`:
```bash
npm run dev -- --port 3001
```

### Build Errors

Clear cache and rebuild:
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Tailwind Not Working

Ensure PostCSS and Tailwind configs are correct:
- Check `tailwind.config.js` exists
- Check `postcss.config.js` uses `tailwindcss` plugin
- Verify Tailwind directives in `src/index.css`

## Need Help?

Check the main `README.md` for more details about the project structure and features.

