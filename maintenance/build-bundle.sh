#!/bin/sh
set -e

cat ./dist/ad-engine.global.js \
    ./dist/ad-products.global.js \
    ./dist/ad-bidders.global.js \
    ./dist/ad-services.global.js \
    ./lib/prebid.min.js \
    > ./dist/global-bundle.js
