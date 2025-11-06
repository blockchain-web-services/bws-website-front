# Claude Code Instructions - Worktree: xai-trackkols

**Created**: 2025-11-06T10:53:05.912Z
**Branch**: xai-trackkols
**Parent Branch**: master

---

## ⚠️ CRITICAL: Working Directory Boundaries

**YOU ARE IN A WORKTREE** (`.trees/xai-trackkols/`)

**IMPORTANT RULES:**

1. ✅ **ONLY modify files within THIS worktree directory**
   - Current worktree path: `/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols`
   - All your work happens HERE

2. ❌ **NEVER modify files in the root repository**
   - Root repository path: `/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front`
   - DO NOT EDIT files outside the worktree

3. 🔍 **Always verify your working directory before file operations**
   ```bash
   pwd  # Should show: /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols
   ```

4. 🚫 **If you need to modify root files, STOP and ask the user first**

**Why this matters:**
- Worktrees share the same git repository but have separate working directories
- Changes to root files affect ALL worktrees and could break parallel development
- The merge script handles bringing changes back to root safely

**Safe operations from worktree:**
- ✅ Modify any file in `.trees/xai-trackkols/`
- ✅ Run tests in `test/` directory
- ✅ Commit changes with `git commit`
- ✅ Run `npm run worktree:merge xai-trackkols` from root (script handles it)

**Unsafe operations:**
- ❌ Modifying `../../` files (root directory)
- ❌ Running `cd ../..` and editing files there
- ❌ Using absolute paths to root repository files

---

## What You're Building

[User should fill this in when creating the worktree]

Describe the feature, bug fix, or task you're working on in this worktree.

---

## Task Checklist

[User should fill this in when creating the worktree]

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

---

## Technical Approach

[User should fill this in when creating the worktree]

Outline your implementation plan, architecture decisions, and key considerations.

---

## Git Workflow for This Worktree

### 1. Make Changes
```bash
# Work on your feature in this worktree
# All file modifications stay within .trees/xai-trackkols/
```

### 2. Commit Locally
```bash
git add .
git commit -m "feat: description of changes"
```

### 3. Merge to Parent Branch
```bash
# IMPORTANT: Run from project root, not from worktree
cd ../..
npm run worktree:merge xai-trackkols
```

The merge script will:
- Validate you're on the correct parent branch (`staging`)
- Merge with `--no-ff` to preserve history
- Exclude worktree-specific files
- Push to remote automatically

### 4. Clean Up (Optional)
```bash
npm run worktree:remove xai-trackkols
```

---

## Important Notes

- **This file (CLAUDE_INSTRUCTIONS.md) is worktree-specific** and should not be committed
- Read `CLAUDE.md` for complete workspace boundary rules
- Use `/check-workspace` command to verify your working location
- See `docs/worktrees/GIT_WORKFLOW.md` for detailed git workflow guide

---

**Last Updated**: 2025-11-06T10:53:05.912Z
