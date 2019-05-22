#!/usr/bin/env bash

# To update & rebuild Dilps, launch this script from the project root directory

# Make a dump of the database
echo "********************* Dumping database..."
if [ ${DEPLOY_ENV:-prod} = "prod" ]; then
    php $PWD/bin/dump-data.php $(date +%Y%m%d%H%M%S).db.backup.sql.gz
fi

# Update project
echo "********************* Updating project files..."
# Default branch is "master" but can be overrided with "GIT_BRANCH" envar
git pull origin ${GIT_BRANCH:-master}

# Rebuild project
sh $PWD/bin/build.sh
