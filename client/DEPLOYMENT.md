# Frontend Deployment Guide

This guide covers deploying the React frontend to various hosting platforms.

## Environment Variables

Before deploying, configure these environment variables in your hosting platform:

```bash
VITE_API_URL=https://your-api-url.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_stripe_key
```

## Build for Production

### Local Build Test

1. **Build the application:**
   ```bash
   npm run build:prod
   ```

2. **Preview the production build locally:**
   ```bash
   npm run preview:prod
   ```

3. **Access the preview at:** `http://localhost:3000`

### Build Output

The production build is created in the `dist/` directory with:
- Optimized and minified JavaScript/CSS
- Code splitting for better performance
- Vendor chunks for efficient caching
- Source maps disabled for security

## Deployment Platforms

### 1. Vercel (Recommended for React)

**Quick Deploy:**
```bash
npm install -g vercel
vercel
```

**Manual Setup:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build:prod`
   - **Output Directory:** `dist`
6. Add environment variables in Settings
7. Deploy!

**Custom Domain:**
- Add in Vercel dashboard → Project Settings → Domains

---

### 2. Netlify

**Quick Deploy:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Manual Setup:**
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build:prod`
   - **Publish directory:** `client/dist`
5. Add environment variables in Site settings → Environment variables
6. Deploy!

**Create `netlify.toml` in client directory:**
```toml
[build]
  base = "client"
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. Azure Static Web Apps

**Using Azure CLI:**
```bash
az login
az staticwebapp create \
  --name dotnetstore-frontend \
  --resource-group your-resource-group \
  --source https://github.com/your-username/DotnetStore \
  --location "East US" \
  --branch main \
  --app-location "client" \
  --output-location "dist"
```

**Manual Setup:**
1. Go to Azure Portal
2. Create "Static Web App" resource
3. Connect to your GitHub repository
4. Configure:
   - **App location:** `/client`
   - **Output location:** `dist`
5. Add environment variables in Configuration
6. GitHub Actions workflow is auto-generated

---

### 4. AWS S3 + CloudFront

**Build and Deploy:**
```bash
# Build
npm run build:prod

# Install AWS CLI
# Configure: aws configure

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Setup:**
1. Create S3 bucket (enable static website hosting)
2. Create CloudFront distribution pointing to S3
3. Configure S3 bucket policy for CloudFront access
4. Add SSL certificate (ACM)
5. Update DNS records

---

## Post-Deployment Checklist

- [ ] Test all routes work correctly
- [ ] Verify API calls connect to production backend
- [ ] Test Stripe payment with test cards
- [ ] Check authentication flow
- [ ] Test cart and checkout process
- [ ] Verify all images load correctly
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors
- [ ] Verify HTTPS is working
- [ ] Test custom domain (if configured)

## Production Environment Variables

Create `.env.production` with:

```bash
VITE_API_URL=https://your-production-api.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

**IMPORTANT:** Never commit `.env.production` to Git!

## CORS Configuration

Make sure your backend API allows requests from your frontend domain:

```csharp
// API/Program.cs
app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .WithOrigins(
           "https://localhost:3000",           // Development
           "https://your-frontend-domain.com"  // Production
       );
});
```

## Troubleshooting

### Build Fails

**Error: "Out of memory"**
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

**Error: "Module not found"**
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Runtime Issues

**API calls fail in production:**
- Check `VITE_API_URL` is set correctly
- Verify CORS is configured on backend
- Check browser console for errors

**Blank page after deployment:**
- Check browser console for errors
- Verify all environment variables are set
- Check routing configuration

**Stripe not working:**
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` uses production key
- Check Stripe dashboard for webhook endpoint
- Verify API has correct Stripe secret key

## CI/CD Pipeline Example

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'client/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        working-directory: ./client
        run: npm ci

      - name: Build
        working-directory: ./client
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
        run: npm run build:prod

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

## Performance Optimization

The build is already optimized with:
- ✅ Code splitting (vendor, redux, mui, stripe chunks)
- ✅ Minification (Terser)
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ No source maps in production

For additional optimization:
- Enable CDN for static assets
- Configure caching headers
- Use image optimization service
- Implement lazy loading for routes

## Monitoring

**Recommended tools:**
- [Vercel Analytics](https://vercel.com/analytics) - Free performance monitoring
- [Google Analytics](https://analytics.google.com) - User analytics
- [Sentry](https://sentry.io) - Error tracking

## Support

For deployment issues:
- Check platform documentation
- Review build logs
- Check browser console
- Verify environment variables
