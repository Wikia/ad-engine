#!/usr/bin/env bash
set -e

npm run build --production
git add dist/
