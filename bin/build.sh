#!/usr/bin/env bash

# This script build all assets for production environment

# If the deploy user exists on the machine, re-run script with that user
DEPLOY_USER="dilpsch"
if id "$DEPLOY_USER" >/dev/null 2>&1; then

    if [ ! "$DEPLOY_USER" == "$USER" ]; then
        echo "Restarting script with user '$DEPLOY_USER'"
        sudo -EH -u $DEPLOY_USER "${BASH_SOURCE}"
        exit
    fi

    # Use /mnt/data/tmp if it exists
    TMP_DIR="/mnt/data/tmp"
    if [ ! -d "$TMP_DIR" ]; then
        TMP_DIR="/tmp"
    fi

    # Declare a fake HOME, so that cache and various config files can be created
    export HOME="/tmp/$DEPLOY_USER"
    export HOME="$TMP_DIR/home-$DEPLOY_USER"
fi

# Exit script on any error
set -e

# Disable progress
if [ "$1" = '--no-progress' ]; then
    NO_PROGRESS='--no-progress'
    PROGRESS_GIT='--quiet'
    export PROGRESS_NG='--progress false'
else
    NO_PROGRESS=
    PROGRESS_GIT=
    export PROGRESS_NG=
fi

echo "********************* Installing git hooks..."
ln -fs ../../bin/pre-commit.sh .git/hooks/pre-commit

echo "********************* Updating Node.js packages..."
yarn install $NO_PROGRESS

echo "********************* Updating all PHP dependencies via composer..."
composer install --classmap-authoritative --no-interaction --no-plugins $NO_PROGRESS

echo "********************* Clear cache"
SERVER_NAME=dilps composer clear-config-cache --no-interaction --no-plugins
SERVER_NAME=tiresias composer clear-config-cache --no-interaction --no-plugins

echo "********************* Updating database..."
./bin/doctrine migrations:migrate --no-interaction
./bin/doctrine orm:generate-proxies

# In a docker environment the Angular build is managed by a supervisor process
if [ ! -n "$DOCKER_RUNNING" ]; then
  echo "********************* Building Angular application..."
  # Default environment is "prod" but can be overrided with "DEPLOY_ENV" envar
  RUN_CONFIG=${DEPLOY_ENV:-prod}

  # Generate sources map by setting GENERATE_MAP env.
  if [ -n "$GENERATE_MAP" ]; then
    RUN_CONFIG="${RUN_CONFIG}-map"
  fi

  yarn run ${RUN_CONFIG}
fi

echo "***************************************************************"
echo "********************* Build finished *************************"
echo "***************************************************************"
