# bwki2025-lowres-langid-ui
This is the repository containing the ui code for the "Sprachidentifikation seltener Sprachen"

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow that automatically builds and deploys the Angular application to GitHub Pages.

### How it works

The workflow (`.github/workflows/deploy.yml`) is triggered on:
- Push to the `main` branch
- Pull requests to the `main` branch (build only, no deployment)
- Manual dispatch

### Setup Requirements

1. **GitHub Pages**: Enable GitHub Pages in your repository settings and set the source to "GitHub Actions"
2. **Angular Project**: Ensure your Angular project has the standard npm scripts:
   - `npm run build` - builds the production version
3. **Node.js**: The workflow uses Node.js 20

### Workflow Features

- ✅ Uses latest GitHub Actions (v4)
- ✅ Builds with production configuration
- ✅ Sets correct base href for GitHub Pages
- ✅ Only deploys from main branch
- ✅ Includes debugging output
- ✅ Proper permissions and concurrency settings
