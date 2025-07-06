# BigMucho Deployment Guide

## Vercel Deployment

This app is configured to deploy on Vercel with optimized settings.

### Automatic Deployment

The repository is configured to automatically deploy the BigMucho app when you push to the main branch. The root `vercel.json` ensures only this app is built and deployed.

### Configuration Details

1. **Root vercel.json** - Configures the monorepo to build only the BigMucho app:

   ```json
   {
     "buildCommand": "yarn install && yarn workspace @apps/bigmucho build",
     "outputDirectory": "apps/bigmucho/dist",
     "installCommand": "yarn install",
     "framework": null,
     "ignoreCommand": "git diff HEAD^ HEAD --quiet ."
   }
   ```

2. **App-specific vercel.json** - Optimizes the app deployment with:
   - Vite framework detection
   - Cache headers for assets (1 year cache)
   - Security headers
   - Silent GitHub comments

### Manual Deployment

1. **Build locally**:

   ```bash
   yarn bigmucho:build
   ```

2. **Preview build**:

   ```bash
   yarn bigmucho:preview
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### Environment Variables

If your app needs environment variables, add them in Vercel's dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variables (e.g., `VITE_API_URL`)

### Domain Configuration

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

### Performance Optimization

The build is optimized with:

- Code splitting (React, Three.js, R3F in separate chunks)
- Asset caching (immutable cache headers)
- Gzip/Brotli compression (automatic on Vercel)

### Build Output

- **Initial JS**: ~1MB (283KB gzipped)
- **Chunks**:
  - three-vendor: 689KB
  - r3f-vendor: 320KB
  - react-vendor: 11KB
  - app: 1KB

### Monitoring

Monitor your deployment at:

- Build logs: Vercel dashboard → Functions tab
- Analytics: Vercel dashboard → Analytics tab
- Performance: Use Vercel Web Vitals

### Troubleshooting

1. **Build fails**: Check if all dependencies are installed
2. **404 errors**: Ensure `outputDirectory` is correct
3. **Large bundle**: Review imports and consider lazy loading

### CI/CD

The `ignoreCommand` in vercel.json prevents builds when no files in the monorepo have changed, saving build minutes.
