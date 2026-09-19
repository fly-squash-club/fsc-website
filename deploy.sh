#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Deploy this directory to the `fsc-dynamic` Vercel project (production).
# Live at: https://flysquash.com  (apex) and https://www.flysquash.com (→ apex 308)
# Also still aliased at: https://fsc-dynamic.opez.com
#
# ── First-time setup ─────────────────────────────────────────────────────────
#   1. Install the CLI (one time, globally):
#        npm i -g vercel
#   2. Authenticate:
#        vercel login
#      Opens a browser. The token persists across sessions until revoked.
#
# ── Run a production deploy ──────────────────────────────────────────────────
#   From the repository root:
#        ./deploy.sh
#   What it does:
#     - Links the current dir to the `fsc-dynamic` project if not already
#     - Uploads the working tree
#     - Runs `npm install && npm run build` on Vercel
#     - Promotes the new build to production and updates all aliased domains
#     - Edge cache for aliased domains is invalidated automatically
#   Typical wall-clock: ~15–20s. The token may expire periodically; if you see
#   "The specified token is not valid", run `vercel login` again.
#
# ── Preview deploys (test before promoting to prod) ──────────────────────────
#   For a preview URL that does NOT touch flysquash.com:
#        vercel --yes       # no --prod flag
#   You'll get a unique vercel.app URL to share/test.
#
# ── Verify ───────────────────────────────────────────────────────────────────
#        curl -sI https://flysquash.com/ | grep -i x-vercel-id
#        curl -s  https://flysquash.com/ | grep -oE '<title>[^<]+</title>'
#
# ── Rollback ─────────────────────────────────────────────────────────────────
#   List recent prod deploys:
#        vercel ls --prod
#   Promote an older one (replace <deployment-url> with a prior one from `ls`):
#        vercel alias set <deployment-url> flysquash.com
#
# ── Notes ────────────────────────────────────────────────────────────────────
#   • Custom domain config (flysquash.com, www, opez.com) lives in the Vercel
#     dashboard → Project Settings → Domains, not in this repo.
#   • DNS for flysquash.com is at GoDaddy. Apex A record → 76.76.21.21 (or any
#     Vercel anycast IP); www CNAME → cname.vercel-dns.com. SSL is auto.
#   • Pushing to `main` deploys automatically — this script is only a manual
#     fallback. It uses the local working tree, not git, so uncommitted changes
#     WILL ship. Prefer pushing to GitHub.
# ─────────────────────────────────────────────────────────────────────────────
set -e

# Always run from this script's directory so we deploy the right project,
# regardless of where the script is invoked from.
cd "$(dirname "$0")"

echo "Linking to fsc-dynamic..."
vercel link --project=fsc-dynamic --yes

echo "Deploying to fsc-dynamic..."
vercel --prod --yes

echo "Done!"
