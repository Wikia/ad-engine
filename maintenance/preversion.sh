#!/usr/bin/env bash
set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ $CURRENT_BRANCH != "dev" ]; then
	echo -e "\033[31mYou're not on dev branch\033[0m ($CURRENT_BRANCH)"
	exit 1
fi

npm run test
npm run lint
