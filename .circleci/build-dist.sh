#!/usr/bin/env bash

set -o errexit -o noclobber -o nounset -o pipefail

echo "Building Distribution"
npm run clean
npm run build
npm run move-dist

echo "Build Done"
