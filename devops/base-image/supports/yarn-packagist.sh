#!/bin/sh

NPM_TOKEN=$1
COMPOSER_TOKEN=$1

composer config --auth http-basic.repo.packagist.com CristianHG2 "$COMPOSER_TOKEN"
yarn config set cacheFolder "$HOME/.cache/yarn/v6"
yarn config set npmScopes.lifespikes.npmRegistryServer "https://npm.pkg.github.com"
yarn config set npmScopes.lifespikes.npmAlwaysAuth true
yarn config set npmScopes.lifespikes.npmAuthToken "$NPM_TOKEN"
