#!/usr/bin/env bash
set -e

bash $PWD/scripts/util-local-npm-install.sh
bash $PWD/scripts/001-docker-compose.sh
