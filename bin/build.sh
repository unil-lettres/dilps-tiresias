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

    # Declare a fake HOME, so that cache and various config files can be created
    export HOME="/tmp/dilps-home"
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

echo "********************* Building Angular application..."
# Default environment is "prod" but can be overrided with "DEPLOY_ENV" envar
yarn run ${DEPLOY_ENV:-prod}

echo "***************************************************************"
echo "********************* Build finished *************************"
echo "***************************************************************"
