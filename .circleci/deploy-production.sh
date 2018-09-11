#!/usr/bin/env bash

set -o errexit -o noclobber -o nounset -o pipefail

VERSION_NUMBER=$(echo "$CIRCLE_BRANCH" | sed 's/[^0-9]*//g')

echo "Doing NPM Release"

PACKAGE_VERSION=$(grep -m1 version package.json | sed -E 's/.*"(([0-9]+\.?)+).*/\1/')

git config --global push.default simple
git config --global user.name $CIRCLE_USERNAME
git config --global user.email piper.tane@gmail.com

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc

git add .
git diff-index --quiet HEAD || git commit -m "Commit changes for $PACKAGE_VERSION"

npm version ${VERSION_COMMAND:-patch} -m "$CIRCLE_BRANCH %s [ci skip]"

if [[ "5" -eq "$VERSION_NUMBER" ]] ;
then
  npm publish --tag stable
else
  npm publish --tag latest
fi

git push --tags
git push --set-upstream origin $CIRCLE_BRANCH

echo "Release done"
