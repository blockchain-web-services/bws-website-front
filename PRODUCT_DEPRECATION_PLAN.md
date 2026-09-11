# Product Deprecation Plan — IPFS, Blockchain Database, NFT.zK

**Status:** Phases 0-4 executed 2026-09-11 on branch `deprecate/ipfs-database-nftzk` (not yet merged)
**Created:** 2026-09-11
**Repository scope:** `bws-website-front` **only**

> **Execution notes.** All in-repo work is done and verified: build 125/125 HTML valid,
> 57 passed / 2 skipped across smoke, e2e navigation, and asset suites, comprehensive
> asset check reporting no 404s. `public/assets/images` went from 99MB to 65MB.
>
> Deviations from the plan as written, all deliberate:
> - Tombstones were built on `BaseLayout` + `Navigation` + `Footer` via a new shared
>   `src/components/RetiredSolution.astro`, rather than the bare-HTML shape of the old
>   redirect stubs. Those stubs were never meant to be seen; a tombstone is.
> - Added `tests/smoke/retired-solutions.spec.js` (7 tests) to lock in the contract:
>   each tombstone returns < 400, sets noindex, explains itself in its h1; no live
>   surface links to one; none appear in the sitemap. This was not in the original plan.
> - Phase 4 also removed the NFT hero image from the "critical images" list in
>   `tests/assets.spec.js` and `tests/image-visibility.spec.js`, which still asserted it.
> - No visual baselines existed for the removed pages, so none needed deleting.
>
> Still open: **§6 handoff** (docs.bws.ninja, gateway repoint) and the two questions in
> §8. Four dead Webflow-migration scripts (`compare-pages.js`, `fix-internal-links.js`,
> `download-full-site.js`, `download-exact-copy.js`, `localize-cdn-resources.js`) still
> name retired pages; none are wired into `package.json` or any workflow, so they were
> left alone.

---

## 1. Scope Boundary

This plan covers **only this repository** (the www.bws.ninja marketing site).

### In scope
Everything under `/home/nacho/Projects/bws/bws-website-front` — Astro pages, components,
data files, build config, automation scripts, tests, and static assets.

### Explicitly OUT of scope — do not modify

| Repository | What lives there | Why untouched |
|---|---|---|
| `bws/docs.bws.ninja` | GitBook/MkDocs source for docs.bws.ninja | Separate product repo; separate deploy |
| `bws/solutions/ipfs/bws-api-ipfs-upload` | ipfs.ninja docs site (~1,170 md) + blog (~622 md) | ipfs.ninja continues as a standalone product |
| `bws/solutions/ipfs/bws-nodes-ipfs` | `ipfs.bws.ninja` gateway infra (CloudFront `E3M6BVCACQKLZR`) | Infrastructure, not website content |
| `bws/solutions/*` (all others) | Product source repos | Not website content |

Work needed in those repos is recorded in **§6 Handoff** for their owners. No commits
from this effort may touch them.

---

## 2. What Is Being Deprecated

| Product | Website URL | Disposition |
|---|---|---|
| IPFS (IPFS.ninja) | `/marketplace/ipfs-upload.html` | **Delisted from BWS marketplace.** Product continues standalone at ipfs.ninja. |
| Blockchain Database | `/marketplace/blockchain-database.html` | Shut down. Covers both former APIs: `BWS.Blockchain.Save` (immutable) and `BWS.Blockchain.Hash` (mutable). |
| Blockchain Database (legacy) | `/marketplace/database-immutable.html`, `/marketplace/database-mutable.html` | Already noindex redirect stubs → convert to tombstones. |
| NFT.zK | `/marketplace/nft-zeroknwoledge.html` | Shut down. |

### Decisions taken
1. **URL handling:** tombstone page + `noindex`, removed from sitemap. Not a hard 404,
   not a 301 to the homepage. Preserves the SEO/JSON-LD work recently shipped while
   removing live product claims.
2. **IPFS is a delist, not a death.** Its tombstone tells visitors the product moved to
   ipfs.ninja and links there. The footer link to `https://ipfs.ninja` **stays**.

---

## 3. Verified Inventory

### 3.1 Pages to remove — `src/pages/marketplace/`
- `ipfs-upload.astro`
- `blockchain-database.astro`
- `nft-zeroknwoledge.astro`
- `database-immutable.astro` *(already a redirect stub)*
- `database-mutable.astro` *(already a redirect stub)*

All three live pages use `src/components/ProductSchema.astro` (SoftwareApplication +
BreadcrumbList JSON-LD). That markup goes with them. `ProductSchema.astro` itself stays —
still used by badges, openagile, telegram-xbot, wallawhats.

### 3.2 Components to delete — `src/components/`
- `marketplaceipfsuploadMainContent.astro`
- `marketplaceblockchaindatabaseMainContent.astro`
- `marketplacenftzeroknwoledgeMainContent.astro`

### 3.3 Components to edit
| File | Lines | Change |
|---|---|---|
| `Navigation.astro` | 352–384 | Remove 3 mega-menu items + their `<link rel="prefetch">` tags |
| `Footer.astro` | 77–79 | Remove Blockchain Database + NFT.zK. **Keep** the `https://ipfs.ninja` external link. |
| `IndexMainContent.astro` | 963–1032 | Remove 3 hardcoded homepage solution cards |
| `aboutMainContent.astro` | 18 | Drop "IPFS infrastructure" from the capabilities sentence |
| `WhitePaperMainContent.astro` | 313 | Rewrite the $BWS burn example — currently "pinning a file to IPFS, minting an NFT, issuing a blockchain-backed…" |

### 3.4 Data — `src/data/solutions.ts`
Remove the `IPFS.ninja`, `Blockchain Database`, and `NFT.zK` entries (3 of 8).

> **Note:** `solutions.ts` and `home/SolutionCard.astro` are **imported by
> `IndexMainContent.astro` but never rendered** — the live homepage cards are hardcoded
> HTML (§3.3). Editing `solutions.ts` is hygiene so the data file doesn't contradict the
> site; the user-visible change is in the hardcoded markup. The `Database` and `NFT`
> categories disappear entirely. There is no category-filter UI to update — `category`
> only drives a CSS badge class.

### 3.5 Build config — `astro.config.mjs`
Lines 14–15 currently exclude 2 redirect stubs from the sitemap. Extend the filter to all
5 tombstoned paths.

### 3.6 Automation scripts
| File | Lines | Change | Urgency |
|---|---|---|---|
| `scripts/generate-articles.js` | 28 | Remove `'IPFS'` from `PRODUCT_ROTATION` | **HIGH** |
| `scripts/generate-articles.js` | 71–84 | Remove `'IPFS'` and `'IPFS.ninja'` product-map entries | HIGH |
| `scripts/generate-articles.js` | 280 | Remove the IPFS paragraph from the Claude prompt context | HIGH |
| `scripts/index-docs-site.js` | 44–82 | Remove 11 crawl paths (`bws.ipfs.upload`, `bws.blockchain.save`, `bws.blockchain.hash`, `bws.nft.zk`, `snapshots/bws.ipfs.upload`) | Low |

**Why HIGH:** `.github/workflows/generate-articles.yml` runs on `cron: '0 10 * * *'` and is
**live**. Until line 28 changes, the pipeline keeps publishing new IPFS marketing articles
daily and auto-committing them.

`index-docs-site.yml` and `discover-docs-pages.yml` both have their schedules commented
out (manual `workflow_dispatch` only), so §3.6 row 4 is not time-sensitive.

### 3.7 Tests — `tests/`
| File | Lines |
|---|---|
| `fixtures/test-data.json` | 37, 40, 41 |
| `smoke/html-structure-validation.spec.js` | 18, 20, 21 |
| `e2e/navigation.spec.js` | 221, 223, 224 |
| `visual/snapshots.spec.js` | 27, 29, 30 |

Stale visual snapshots for the 3 removed pages must be deleted.

### 3.8 Static assets — `public/assets/images/`
Orphaned scraped docs imagery (**verified: zero references anywhere in `src/`** — only
`docs/blockchain-badges/` and `docs/x-bot/` are actually used, by 103 and 105 references
respectively):

| Directory | Size |
|---|---|
| `docs/bws-ipfs/` | 7.7 MB |
| `docs/nftzk/` | 12 MB |
| `docs/blockchain-save/` | 7.1 MB |
| `docs/blockchain-hash/` | 7.1 MB |
| **Total** | **~34 MB** |

Also orphaned once the pages go:
- `marketplace/ipfs/` (328 KB) and `marketplace/fallback/ipfs/`
- `6474d385cfec71cb21a9229a/65061646ead0751dc83790e1_NFT_1200x628*.jpg` (4 variants)
- `6474d385cfec71cb21a9229a/65061830bf101fe685a48e2f_NFT-Marketplace_400x300.jpg`
- `6474d385cfec71cb21a9229a/65061ebf5608b7584d9def34_Hash_400x300.jpg`
- `6474d385cfec71cb21a9229a/65061f550fd7be777e64f36f_Save_400x300.jpg`

### 3.9 Blog — no action required
All 100 articles under `src/pages/articles/` are `blockchain-badges` (50) or `x-bot` (50).
No article covers any deprecated product. Three incidental uses of the word "NFT" as a
generic industry term are correct as written and stay:
- `articles/XBot20251118MainContent.astro:96`
- `articles/XBot20251127MainContent.astro:99`
- `articles/BlockchainBadges20251130MainContent.astro:27`

---

## 4. Execution Phases

### Phase 0 — Stop automated publishing *(time-sensitive)*
1. `scripts/generate-articles.js` — §3.6 rows 1–3.

Commit and push on its own. Until this lands, the 10:00 UTC job keeps shipping IPFS content.

### Phase 1 — Tombstones
2. Replace the 3 live marketplace pages with tombstones modelled on the existing
   `database-immutable.astro` pattern, minus the meta-refresh: `noindex`, a short
   "this solution has been retired" body, and a link back to the marketplace.
3. Convert `database-immutable.astro` and `database-mutable.astro` from redirect stubs to
   the same tombstone (their redirect target no longer exists).
4. The IPFS tombstone gets different copy — "IPFS.ninja is now a standalone product" with
   a link to `https://ipfs.ninja`.
5. Delete the 3 `*MainContent.astro` components.
6. `astro.config.mjs` — extend the sitemap filter to all 5 paths.

### Phase 2 — De-link
7. `Navigation.astro`, `Footer.astro`, `IndexMainContent.astro` — §3.3.
8. `aboutMainContent.astro`, `WhitePaperMainContent.astro` — prose rewrites.
9. `src/data/solutions.ts` — remove 3 entries.

### Phase 3 — Tests
10. Update the 4 test files; regenerate/delete affected visual snapshots.

### Phase 4 — Asset & script cleanup
11. Delete the orphaned image directories and files in §3.8.
12. `scripts/index-docs-site.js` — remove the 11 dead paths.

---

## 5. Verification

```bash
npm run build                      # must pass clean incl. HTML validation
cd tests && npm test               # smoke + e2e + a11y
```

Manual checks against `npm run preview`:
- [ ] No nav mega-menu entry for any deprecated product
- [ ] Footer shows `ipfs.ninja` external link, no Blockchain Database / NFT.zK
- [ ] Homepage solutions grid renders 5 cards, no layout gap
- [ ] All 5 tombstone URLs return a page with `<meta name="robots" content="noindex">`
- [ ] `_site/sitemap-0.xml` contains none of the 5 paths
- [ ] `grep -ri "nft.zk\|blockchain database" _site/*.html` returns only tombstones
- [ ] Article index on `/resources` is unchanged (100 articles)

---

## 6. Handoff — Work Owned by Other Repos

Recorded here for traceability. **Not actionable in this repository.**

### `docs.bws.ninja`
- `quick-start.md` — the entire onboarding tutorial is built on `BWS.Blockchain.Hash`
  (6 occurrences). Needs a rewrite against a surviving solution or the docs site loses its
  getting-started path.
- `api-how-tos/main-api-methods/call-api-method.md` — `call` example uses `BWS.Blockchain.Save`.
- `api-how-tos/main-api-methods/fetch-api-method.md` — `fetch` response example is `BWS.NFT.zK`.
- `platform-fees/README.md:34-39` — worked fee example is "100 NFTs via BWS.NFT.zK + IPFS Ninja".
- `SUMMARY.md` — removing Save/Hash/NFT.zK **empties the entire PLATFORM APIs section**.
  Only X Bot (marketplace) and Badges (product-docs) survive. Needs a nav restructure.
- `README.md:18` — landing card table lists Save / Hash / NFT.zk.
- `certificate-of-trust.md` — claims "Every BWS Solution provides a Certificate of Trust";
  written when Save was the flagship. Verify still true.
- Delete `solutions/bws.blockchain.{save,hash}/`, `solutions/bws.nft.zk/`, 4 `product-docs/`
  dirs, matching `media-assets/blurbs/` + `snapshots/` entries. Rebuild `site/`, regen sitemap.
- Add a pointer to `ipfs.ninja/docs` where BWS.IPFS.Upload docs used to be.

### `bws-nodes-ipfs` — gateway dependency
`ipfs.bws.ninja` (CloudFront `E3M6BVCACQKLZR`) currently serves **live badge images** and
all existing NFT.zK token metadata (`image` / `nft` URLs baked into on-chain records).
Badges is a surviving product that depends on it — see
`src/components/marketplaceblockchainbadgesMainContent.astro:110,140`
("Badge images are pinned to IPFS… pinned to IPFS on save").

Since ipfs.ninja continues operating, this is a **domain repoint, not a re-host**. But if
`ipfs.bws.ninja` is retired alongside the BWS platform API without repointing to the
ipfs.ninja gateway, every already-issued badge image and every minted NFT's stored URL
breaks permanently. **Must be resolved before any IPFS infrastructure shutdown.**

> Open question for the Badges owner: the Badges marketing copy on this site stays accurate
> either way, so no website change is required — but confirm before shutdown.

---

## 7. Rollback

Each phase is a single commit on a feature branch merged with `--no-ff`. Revert the merge
commit to restore. Tombstone pages are additive; the deleted assets in Phase 4 are
recoverable from git history.

---

## 8. Open Questions

1. **Does `ipfs.bws.ninja` survive?** Badges (a surviving product) still describes IPFS
   pinning at `src/components/marketplaceblockchainbadgesMainContent.astro:110,140`, and
   that copy stays accurate only while the gateway resolves. See §6.
2. **What replaces the emptied PLATFORM APIs section** in the docs nav? Owned by
   docs.bws.ninja.
