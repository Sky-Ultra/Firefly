# Repository migration — 2026-10-30

The owner authorized an independent repository with the existing name, retention of the original fork, and an unchanged public website. Both repositories remain public; visibility changes require a later instruction.

| Purpose | Repository | Identity |
| --- | --- | --- |
| Active development and deployment | https://github.com/Sky-Ultra/Firefly | Independent repository, ID 1439447294 |
| Original fork and retained backup | https://github.com/Sky-Ultra/Firefly-Legacy | Original repository ID 1295626000 |

## Preserved history and website

The original remote was mirror-cloned and checked with `git fsck --full`. All 1,369 original commits were preserved without rewriting their IDs, authors or dates. The original master head was `aeb2df630294b088d316aba3f5c999aa222e5b2e`, with tree `a5167972a04803c34361d0f92c9b865e188b862b`. No images were removed or recompressed.

An empty deployment-verification commit and this operational documentation follow that original history in the active repository. They do not change website application files, article content, assets, styles, passwords or backend logic.

The original repository retains its original GitHub records. The new repository has its own repository-level metadata and run history; copying Git history does not copy stars, issues or historical workflow runs. Contribution credit is calculated by GitHub from eligible commits and account associations, so graph recalculation may take time.

## Normal publication

- Local workspace remains `D:/Website/Firefly`. Push normal changes to `origin`, which points to the active Firefly repository; `master` tracks `origin/master`.
- The `legacy` remote is for recovery reads only; its push URL is disabled.
- Cloudflare builds the active repository's `master` branch using `pnpm run build` and deploys with `npx wrangler deploy` to the existing Worker named `firefly`.
- Keep the existing domain routes, `PRIVATE_ARTICLES` binding, `PrivateArticleBackend` class, migration history, private namespace and preview-URL restrictions intact. Never recreate these resources merely to change the Git repository.
- The external Twikoo service and comment identities remain unchanged.
- GitHub Pages uses the active repository, the same `github-pages` environment and master branch rule, and the existing custom domain. Legacy Actions are disabled to prevent competing publications.
- The existing build variable is configured separately in GitHub and Cloudflare. Never commit its plaintext or private article-management material.

## Recovery

Keep both repositories and the external local mirror backup. If recovery becomes necessary, use the retained server-protected Legacy head, or a verified later active commit; do not roll back to a pre-backend-protection deployment. Reconnect the same Cloudflare Worker rather than creating another Worker or private namespace. Normal development continues only in the active repository.
