#!/bin/sh
set -e

FILES[0]="./dist/ad-engine.global.js"
FILES[1]="./dist/ad-products.global.js"
FILES[2]="./dist/ad-bidders.global.js"
FILES[3]="./dist/ad-services.global.js"
FILES[4]="./lib/prebid.min.js"

rm -f ./dist/global-bundle.js
for file in "${FILES}"; do (cat ${file}; echo) >> ./dist/global-bundle.js; done
