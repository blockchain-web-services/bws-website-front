# GitHub Pages Deployment Guide

## Overview

This website is automatically deployed to GitHub Pages at [www.bws.ninja](https://www.bws.ninja) using GitHub Actions.

## Deployment Architecture

```
main branch (source) → GitHub Actions → gh-pages branch (built site) → GitHub Pages → www.bws.ninja
```

## Initial Setup

### 1. GitHub Repository Settings

#### Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` (will be created by first deployment)
4. **Folder**: `/ (root)`
5. Click **Save**

#### Custom Domain Configuration

1. In **Settings** → **Pages** → **Custom domain**
2. Enter: `www.bws.ninja`
3. Click **Save**
4. Enable **Enforce HTTPS**

### 2. DNS Configuration (Already Done)

For custom domain `www.bws.ninja`:

1. **CNAME Record**: Point `www` to `[username].github.io`
2. **A Records** (for apex domain if needed):
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

### 3. Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` or `master`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### 4. Environment Configuration

1. Go to **Settings** → **Environments**
2. Create `github-pages` environment
3. Add protection rules:
   - Required reviewers (optional)
   - Deployment branches: `main`/`master` only
4. Add any secrets if needed

## Deployment Workflow

### Automatic Deployment

Deployments trigger automatically when:
- Code is pushed to `main`/`master` branch
- Pull request is merged to `main`/`master`

### Deployment Process

1. **Test Phase**: Run all Playwright tests
2. **Build Phase**: Build Astro site to `_site/`
3. **Deploy Phase**: Push to `gh-pages` branch
4. **Validate Phase**: Run smoke tests on production

### Manual Deployment

To trigger deployment manually:

1. Go to **Actions** tab
2. Select **Build, Test, and Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Monitoring

### Health Checks

Automated monitoring runs every 6 hours:
- HTTP status checks
- SSL certificate validation
- Performance monitoring
- Critical resource availability

### View Monitoring Status

1. Go to **Actions** tab
2. Select **Production Monitoring** workflow
3. View latest run results

### Alerts

If monitoring fails:
- GitHub Issue is created automatically
- Tagged as `urgent`, `monitoring`, `production`
- Contains failure details and action items

## Rollback Procedure

### Automatic Rollback

If post-deployment tests fail, an issue is created with rollback instructions.

### Manual Rollback

1. Go to **Actions** tab
2. Select **Rollback Deployment** workflow
3. Click **Run workflow**
4. Enter commit SHA to rollback to (or leave empty for previous)
5. Click **Run workflow**

### Finding Commit SHA

```bash
# List recent commits
git log --oneline -10

# Find deployment SHA on production
curl https://www.bws.ninja/deployment-sha.txt
```

## Troubleshooting

### Deployment Failed

1. Check **Actions** tab for error details
2. Review test results in artifacts
3. Fix issues and push to trigger new deployment
4. Or run rollback if urgent

### Site Not Accessible

1. Verify GitHub Pages is enabled in Settings
2. Check `gh-pages` branch exists
3. Confirm custom domain DNS is configured
4. Check SSL certificate status

### Tests Failing in CI

1. Download test artifacts from Actions
2. Review playwright-report for details
3. Run tests locally to reproduce:
   ```bash
   npm test
   ```

### Slow Performance

1. Check Lighthouse scores in monitoring
2. Review bundle sizes in build logs
3. Optimize images and assets
4. Check Core Web Vitals metrics

## URLs and Endpoints

- **Production**: https://www.bws.ninja
- **GitHub Pages Default**: https://[username].github.io/[repo-name]
- **Deployment Status**: Check Actions tab
- **Build Artifacts**: Available in each workflow run

## Local Testing

### Test Against Production

```bash
# Run smoke tests against production
PLAYWRIGHT_BASE_URL=https://www.bws.ninja npm run test:smoke
```

### Simulate Build

```bash
# Build locally
npm run build

# Preview built site
npm run preview
```

## Best Practices

1. **Always test locally** before pushing to main
2. **Use pull requests** for code review
3. **Monitor Actions tab** after deployment
4. **Check production** after deployment completes
5. **Keep dependencies updated** for security

## Deployment Checklist

Before deploying:
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors
- [ ] Images optimized
- [ ] HTML validated

After deployment:
- [ ] Site accessible at www.bws.ninja
- [ ] No 404 errors for resources
- [ ] Forms working correctly
- [ ] Mobile responsive
- [ ] SSL certificate valid

## Support

For deployment issues:
1. Check this documentation
2. Review GitHub Actions logs
3. Check GitHub Pages settings
4. Create issue in repository

## References

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)