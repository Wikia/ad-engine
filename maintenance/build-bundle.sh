#!/bin/sh
set -e

cat ./dist/ad-engine.global.js <(echo) ./dist/ad-products.global.js <(echo) ./dist/ad-bidders.global.js <(echo) ./dist/ad-services.global.js <(echo) ./lib/prebid.min.js > ./dist/global-bundle.js
