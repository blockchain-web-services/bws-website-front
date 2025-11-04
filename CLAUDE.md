# ⚠️ WORKTREE WORKSPACE BOUNDARY

**Current Location:** `.trees/xai-trackkols/`
**Working Directory:** `/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols`

---

## 🚨 CRITICAL RULES

### 1. STAY IN THIS WORKTREE
**ONLY modify files within this directory**
- ✅ Safe: Any file in `/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols`
- ❌ Forbidden: Any file in `/mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front` (root repository)

### 2. VERIFY BEFORE EDITING
**Always check your working directory before file operations:**
```bash
pwd  # Must show: /mnt/x/Git/blockchain-web-services/bws/bws-front/bws-website-front/.trees/xai-trackkols
```

### 3. DO NOT MODIFY ROOT
**Never change files in `../../` (the root repository)**
- Root files affect ALL worktrees and other developers
- Changes must go through the merge process
- If you need to modify root files, ASK THE USER FIRST

### 4. READ INSTRUCTIONS FIRST
**See `CLAUDE_INSTRUCTIONS.md` for:**
- ✓ What you're building and why
- ✓ Task checklist
- ✓ Technical approach
- ✓ Git workflow for this worktree
- ✓ Complete workspace boundary rules

---

## When to Access Root Repository

**Only these operations should touch root:**

1. **Merging worktree** (script handles boundaries):
   ```bash
   cd ../..
   npm run worktree:merge xai-trackkols
   ```

2. **Listing worktrees** (read-only):
   ```bash
   npm run worktree:list
   ```

3. **Creating new worktrees** (from root):
   ```bash
   npm run worktree:create
   ```

**All development work happens HERE in the worktree.**

---

⚠️ **If Claude Code suggests modifying root files, STOP and confirm with the user first.**
