# Claude Auto-Fix Setup

## Overview

This repository uses Claude to automatically fix test failures. When tests fail in CI, an issue is created and Claude is triggered to fix them automatically.

## How It Works

1. **Test Failure Detection**: When tests fail in the `deploy.yml` workflow
2. **Issue Creation**: An issue is automatically created with detailed error information
3. **Claude Trigger**: The issue mentions @claude and includes the `/fix-ci` command
4. **Automatic Fix**: Claude reads the issue and attempts to fix the failures
5. **PR Creation**: Claude creates a PR with the fixes

## Configuration

### Required Secret: PAT_REPOS_AND_WORKFLOW

The repository must have a Personal Access Token configured to enable workflow chaining.

**Secret Name**: `PAT_REPOS_AND_WORKFLOW`
**Location**: Repository Settings → Secrets and variables → Actions
**Required Permissions**:
- `repo` (full control of private repositories)
- `workflow` (update GitHub Action workflows)

### Why PAT is Required

GitHub Actions using `GITHUB_TOKEN` cannot trigger other workflows (by design to prevent infinite loops). Using a PAT allows:
- Issues created by `deploy.yml` to trigger `claude.yml`
- Comments added via API to trigger Claude workflow
- Automatic workflow chaining without manual intervention

## Setting Up the PAT

### Step 1: Create Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Name: `BWS CI PAT` (or similar descriptive name)
4. Expiration: 90 days (recommended) or longer
5. Select scopes:
   - [x] `repo` - Full control of private repositories
   - [x] `workflow` - Update GitHub Action workflows
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately (you won't see it again)

### Step 2: Add to Repository Secrets

1. Navigate to: Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `PAT_REPOS_AND_WORKFLOW`
4. Value: Paste the token from Step 1
5. Click "Add secret"

## Testing the Setup

After configuration, you can test the automatic triggering:

1. Create a test that intentionally fails
2. Push to main/master branch
3. Verify:
   - Issue is created when tests fail
   - Claude workflow triggers automatically
   - Claude attempts to fix the issue

## Token Maintenance

### Rotation Schedule

- Tokens should be rotated every 90 days
- Set calendar reminder before expiration
- Follow the same creation process for new token

### Monitoring

Check workflow runs regularly:
- If Claude stops auto-triggering, check token expiration
- Look for "Resource not accessible by integration" errors
- Verify secret name hasn't changed

### Fallback Behavior

If PAT is not configured or expires:
- Issues will still be created (using GITHUB_TOKEN)
- Claude won't auto-trigger
- Manual trigger still possible by commenting "@claude" on the issue

## Security Considerations

1. **Minimal Permissions**: Only grant required scopes
2. **Regular Rotation**: Replace token every 90 days
3. **Never Commit Token**: Token should only exist in GitHub Secrets
4. **Access Control**: Limit who can modify repository secrets
5. **Audit Usage**: Monitor GitHub audit log for token usage

## Troubleshooting

### Claude Not Triggering

1. Check PAT hasn't expired:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Look for expiration date

2. Verify secret name:
   - Must be exactly `PAT_REPOS_AND_WORKFLOW`
   - Check in repository secrets settings

3. Check workflow logs:
   - Look for authentication errors
   - Verify issue was created successfully

### Common Issues

| Problem | Solution |
|---------|----------|
| "Resource not accessible by integration" | PAT expired or missing permissions |
| Claude not responding to @claude | Check claude.yml workflow is enabled |
| Issue created but no Claude trigger | PAT not configured, using GITHUB_TOKEN |
| Workflow fails with auth error | Token lacks required scopes |

## Related Files

- `.github/workflows/deploy.yml` - Creates issues using PAT
- `.github/workflows/claude.yml` - Claude workflow configuration
- `scripts/collect-test-errors.js` - Generates issue content with @claude mention
- `.github/workflows/README.md` - Overall workflow documentation

## Support

For issues with Claude auto-fix:
1. Check this documentation
2. Review workflow run logs
3. Ensure PAT is properly configured
4. Open an issue if problems persist