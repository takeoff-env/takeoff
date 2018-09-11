#!/usr/bin/env bash

set -o errexit -o noclobber -o nounset -o pipefail

echo "Doing NPM Beta Release branch: $CIRCLE_BRANCH (triggered by $CIRCLE_USERNAME)"

# Here we only want the semver not the full version
PACKAGE_VERSION=$(grep -m1 version package.json | sed -E 's/.*"(([0-9]+\.?)+).*/\1/')
BETA_PACKAGE_VERSION=$PACKAGE_VERSION-beta.$CIRCLE_BUILD_NUM

git config --global push.default simple
git config --global user.name $CIRCLE_USERNAME
git config --global user.email piper.tane@gmail.com

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc

echo "Add any build artifacts"
git add .
git diff-index --quiet HEAD || git commit -m "Commit changes for $BETA_PACKAGE_VERSION"
git branch --set-upstream-to $CIRCLE_BRANCH

echo "Version and Publish"
npm version $BETA_PACKAGE_VERSION -m "$CIRCLE_BRANCH %s [ci skip]"
npm publish --tag beta

echo "Push changes to branch"
git push --tags
git push --set-upstream origin $CIRCLE_BRANCH

echo "Release done"
