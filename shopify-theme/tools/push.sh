#!/usr/bin/env bash
# Build the utility CSS and push the given theme files to the DRAFT theme only (id 205434061145).
#   bash tools/push.sh "sections/janks-*" "templates/page.about.json" ...
# With no arguments it pushes everything the JANKS build owns.
set -e
export MSYS_NO_PATHCONV=1
cd "$(dirname "$0")"                      # shopify-theme/tools (relative paths below keep node happy under Git Bash)
node fix-prefix.mjs ../janks-theme/sections/*.liquid ../janks-theme/snippets/*.liquid
node build-css.mjs 2>&1 | grep janks-tw || true
cd ../janks-theme
ARGS=()
if [ "$#" -eq 0 ]; then
  set -- "layout/theme.liquid" "assets/janks*" "assets/jt-*" "assets/cart-drawer.js" "sections/janks-*" "sections/header-group.json" "sections/footer-group.json" "sections/cart-drawer.liquid" "sections/cart-icon-bubble.liquid" "snippets/jt-*" "snippets/cart-drawer.liquid" "templates/*.json"
fi
for p in "$@"; do ARGS+=(--only "$p"); done
# --theme is pinned to the unpublished draft; the live theme is never addressed
npx shopify theme push --store janks-2.myshopify.com --theme 205434061145 --nodelete "${ARGS[@]}" 2>&1 | grep -E "success|error|warning" -A6 | head -24
