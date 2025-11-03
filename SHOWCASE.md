# 🚀 How to Showcase Your Dashboard

## The Easiest Way to View Your Dashboard

Follow these simple steps:

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Start the Preview Server
```bash
npm run preview
```

### Step 3: Open in Browser
You'll see output like:
```
➜  Local:   http://localhost:4173/
```

**Just copy that URL and paste it in any web browser!**

---

## Quick Reference Card

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Development mode - live updates while coding |
| `npm run build` | Creates production-ready files in `dist/` folder |
| `npm run preview` | Shows production build in browser |
| `npm run lint` | Checks code for errors |

---

## For Sharing with Others

### On Same Network
```bash
npm run preview -- --host
```
Then others on your network can access it using your computer's IP address.

### On Internet (Free)
1. Push to GitHub
2. Deploy to Vercel:
   ```bash
   npx vercel
   ```
3. Get shareable link instantly!

---

## Troubleshooting

**Port already in use?**
- The preview server will auto-find another port
- Just use whatever port it shows you

**Need to rebuild?**
```bash
npm run build
npm run preview
```

**Reset everything?**
```bash
npm install
npm run build
npm run preview
```

---

## What You'll See

Your dashboard includes:
- ✅ Live updating mock data every 2 seconds
- ✅ Interactive charts and graphs
- ✅ Plant map visualization
- ✅ Real-time KPIs and metrics
- ✅ Beautiful, modern UI

Perfect for showcasing your control room dashboard!

