# Deployment Guide for MoodGarden

This guide will help you deploy MoodGarden to make it publicly accessible.

## Quick Deploy Options

### Option 1: Vercel (Easiest - Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/Mental-Health-Tracker.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Vite - just click "Deploy"
   - Your app will be live in ~2 minutes at `https://your-project.vercel.app`

**That's it!** Vercel handles everything automatically.

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop the `dist` folder, OR
   - Connect your Git repository for automatic deployments
   - Your app will be live at `https://your-project.netlify.app`

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/Mental-Health-Tracker"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to your repository Settings → Pages
   - Select source: `gh-pages` branch
   - Your app will be at `https://yourusername.github.io/Mental-Health-Tracker`

### Option 4: Other Platforms

**Railway, Render, Fly.io** - All support Vite/React apps:
- Connect your GitHub repo
- They auto-detect the build settings
- Deploy with one click

## Important Notes

1. **Data Storage**: All data is stored in the user's browser (localStorage). No backend needed!

2. **AI Chatbot**: Users can optionally add their OpenAI API key in Settings for enhanced AI responses. Without a key, the chatbot uses rule-based responses.

3. **Environment Variables**: No environment variables needed for basic functionality.

4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Node Version**: 18+ recommended

## Custom Domain

All platforms above support custom domains:
- Vercel: Settings → Domains
- Netlify: Domain settings → Add custom domain
- GitHub Pages: Repository Settings → Pages → Custom domain

## Troubleshooting

- **Build fails**: Make sure Node.js 18+ is installed
- **Routes not working**: Configure your hosting platform to serve `index.html` for all routes (SPA mode)
- **Assets not loading**: Check that the base path is correct in `vite.config.ts`

## Security Note

The app stores all data locally in the browser. No data is sent to any server except:
- OpenAI API (only if user adds their own API key)
- HSE website links (external resources)

Your users' data remains completely private and local to their device.

