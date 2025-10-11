# GitHub Actions Workflow Structure

## Overview
The deployment pipeline has been split into two specialized workflows for better separation of concerns and cleaner logic.

## Workflow Files

### 1. main-deploy.yml
**Triggers:** Push to main or master branches
**Purpose:** Production deployment with automatic test failure handling

**Jobs:**
1. **test**: Run full test suite
2. **handle-test-failure** (if tests fail):
   - Creates new fix branch: `fix/test-failures-YYYY-MM-DD-HH-MM-SS-[sha]`
   - Moves BRANCH_ISSUES.md to `fixes/[branch-name]/` folder
   - Creates PR back to main with auto-merge enabled
   - Creates tracking issue with test-failure label
3. **build-and-deploy** (if tests pass):
   - Builds production site
   - Deploys to GitHub Pages (www.bws.ninja)
4. **validate-deployment**: Runs smoke tests on production

### 2. fix-branch.yml
**Triggers:** Push to any fix/* branch
**Purpose:** Test fix branches and handle auto-merge when tests pass

**Jobs:**
1. **test**: Run full test suite
2. **update-on-failure** (if tests fail):
   - Creates timestamped report: `BRANCH_ISSUES_DD-MM-HH.md`
   - Commits to current branch in `fixes/[branch-name]/` folder
   - Updates PR with failure comment
   - Adds 'tests-failing' label
3. **auto-merge-on-success** (if tests pass):
   - Updates PR with success comment
   - Adds 'tests-passing' and 'ready-to-merge' labels
   - Enables auto-merge (squash merge)
   - Closes related test-failure issues

## Key Features

### Auto-Merge Capability
- Fix branches automatically merge to main when all tests pass
- Uses GitHub CLI for auto-merge with squash strategy
- Deletes branch after merge
- Closes related issues automatically

### Test Failure Tracking
- Each failure creates a detailed BRANCH_ISSUES file
- Files include:
  - Test statistics (total, passed, failed)
  - Failed test names
  - Error output extracts
  - Workflow run links
  - Commit SHA references

### File Organization
```
fixes/
└── [branch-name]/
    ├── BRANCH_ISSUES.md (initial failure from main)
    ├── BRANCH_ISSUES_DD-MM-HH.md (subsequent failures)
    └── ... (more timestamped reports as needed)
```

## Workflow Flow

### Main Branch Flow
```
Push to main → Tests run
├── Pass → Deploy to production → Validate
└── Fail → Create fix branch → Create PR → Create issue
```

### Fix Branch Flow
```
Push to fix/* → Tests run
├── Pass → Enable auto-merge → Close issues → Merge to main
└── Fail → Add timestamped report → Update PR → Continue fixing
```

## Configuration

### Environment Variables
- `NODE_VERSION`: "20" (consistent across workflows)

### Permissions Required
- contents: write (for commits and branches)
- pages: write (for GitHub Pages deployment)
- pull-requests: write (for PR creation/updates)
- issues: write (for issue creation/updates)
- id-token: write (for deployment)

### Secrets Used
- `PAT_REPOS_AND_WORKFLOW`: Personal Access Token with repo and workflow permissions (optional, falls back to GITHUB_TOKEN)
- `GITHUB_TOKEN`: Default token for basic operations

## Benefits of Split Structure

1. **Cleaner Logic**: Each workflow handles specific scenarios
2. **No Branch Detection**: Workflows triggered by branch patterns
3. **Simpler Conditionals**: Less complex if/else logic
4. **Better Maintainability**: Easier to understand and modify
5. **Proper Auto-Merge**: Fix branches can auto-merge when ready
6. **Clear Separation**: Main branch deploys, fix branches only test

## Migration Notes

- Original `deploy.yml` archived as `deploy.yml.backup`
- New structure activated immediately upon merge
- No changes required to existing PRs