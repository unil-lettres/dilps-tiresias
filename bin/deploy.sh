#!/usr/bin/env bash

# To update & rebuild Dilps, launch this script from the project root directory

# Make a dump of the database
if [ ${DEPLOY_ENV:-prod} = "prod" ]; then
    echo "********************* Dumping database..."
    php $PWD/bin/dump-data.php $PWD/data/dump/$(date +%Y%m%d%H%M%S).db.backup.sql.gz
fi

# Update project
echo "********************* Updating project files..."
# Default branch is "master" but can be overrided with "GIT_BRANCH" envar
git pull origin ${GIT_BRANCH:-master}

# Rebuild project
sh $PWD/bin/build.sh

# Report new build
if [ ${DEPLOY_ENV:-prod} = "prod" ]; then
    echo "********************* Report build to error tracker..."
    git fetch --tags
    APP_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)
    yarn run report-build -k "${BUGSNAG_API_KEY}" -v "${APP_VERSION}" -s "${DEPLOY_ENV}"
fi
