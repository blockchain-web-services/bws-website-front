# Claude Code Instructions - Worktree: xai-trackkols

**Created**: 2025-10-31T17:26:18.896Z
**Branch**: xai-trackkols
**Parent Branch**: master

## Feature/Fix Description

Create a set of github actions to track X (twitter) KOLs who have an impact in the crypto space and use @BWSXAI account X API to interact with those describing BWS product's hihglights. The goal is to improve BWS endorsement and awareness on X.

## Task List

- [ ] Using a set of initial KOLs usernames we know can have an impact in the crypto space, extend that list by checking who they follow, and if those have recent posts mentionning crypto and those posts impact (likes, views, shares, etc).
- [ ] For the growing list of X KOLs we will have, check their last posts using antrhopic API, evaluate if the topic is related to crypto projects and post a reply using the reference of one of our products. The challenge is to create replies that do not sound as spamm.
- [ ] Both processes should run on a daily basis using Github Actions, the already available anthropic key, and a new set of X api keys for posting as BWSXAI.

## Technical Approach

main components will be X API for querying the initial list of KOLs and find following KOLs, and iterate a certain number of levels (example: KOL1 has 3 KOLs, those 3 KOLS have each 5 KOLs, etc). As we don't have any database, we should use the file system to save KOLs and their graph relationships.
second component will be the Antropic API to evaluate KOLs posts and 1) evaluate if the content of the post opens the door to a reply (we don't want to spamm) and 2) write a reply including BWS related products information

## Testing Strategy

to verify the system works, we need to check if the list of KOLs grows, and if those are "persons" (the hard part is to evaluate if an account a KOL is following is another KOL, and not a project or business account
we also need to validate we effectively can write replies to KOLs posts, and check the content is properly formatted and includes at least one of the products reference.

## Git Workflow for This Worktree

### 1. Rebase from root branch
```bash
git fetch origin
git rebase origin/master
```

### 2. Commit your changes
```bash
git add .
git commit -m "feat: description"
```

### 3. Run tests before merging
```bash
cd test
npm test
```

### 4. Merge to root (from root directory)
```bash
cd ../..  # Return to root
git checkout master
git merge --no-ff xai-trackkols
```

### 5. Push to origin
```bash
git push origin master
```

### 6. Remove worktree when done
```bash
npm run worktree:remove xai-trackkols
```

---

⚠️ **Note**: This file is gitignored and won't be committed. It's for your local context while working in this worktree.
