# Deployment Configuration

This monorepo is configured to deploy only the `apps/bigmucho` application to Vercel.

## Current Setup

### Root `vercel.json`

```json
{
  "buildCommand": "yarn install && yarn workspace @apps/bigmucho build",
  "outputDirectory": "apps/bigmucho/dist",
  "installCommand": "yarn install",
  "framework": null,
  "ignoreCommand": "git diff HEAD^ HEAD --quiet ."
}
```

This configuration:

- Installs dependencies for the entire monorepo
- Builds only the BigMucho app using workspace commands
- Serves the built files from `apps/bigmucho/dist`
- Skips builds when no files have changed

### What Gets Deployed

Only the BigMucho app (`apps/bigmucho/`) is built and deployed:

- **Built files**: HTML, CSS, JavaScript bundles
- **Static assets**: Images, fonts from public folder
- **Not deployed**:
  - React Three Fiber source code
  - Example demos
  - Test renderer
  - ESLint plugin

### Build Output

The production build creates:

- `index.html` - Entry point
- `assets/` - Optimized JS/CSS chunks
  - `three-vendor-*.js` - Three.js library (689KB)
  - `r3f-vendor-*.js` - React Three Fiber (357KB)
  - `react-vendor-*.js` - React runtime (12KB)
  - `index-*.js` - App code (175KB)

Total: ~1.2MB minified, ~354KB gzipped

### Environment Variables

Add any required environment variables in Vercel's dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables (prefix with `VITE_` for Vite apps)
3. Redeploy to apply changes

### Custom Domains

Configure domains in Vercel dashboard:

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Monitoring

- **Build logs**: Check Vercel dashboard for build output
- **Function logs**: View runtime logs in Functions tab
- **Analytics**: Enable Web Analytics for performance metrics

## Alternative Deployment Targets

To deploy elsewhere, use:

```bash
# Build the app
yarn workspace @apps/bigmucho build

# Output is in apps/bigmucho/dist/
# Upload this folder to any static host
```

Compatible with:

- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static file host
