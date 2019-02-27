#!/bin/sh
set -e

FILES=(
    './dist/ad-engine.global.js'
    './dist/ad-products.global.js'
    './dist/ad-bidders.global.js'
    './dist/ad-services.global.js'
    './lib/prebid.min.js'
)

rm -f ./dist/global-bundle.js
for file in "${FILES[@]}"; do (cat ${file}; echo) >> ./dist/global-bundle.js; done
