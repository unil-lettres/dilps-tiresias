#!/usr/bin/env bash

# To update & rebuild Dilps, launch this script from the project root directory

# To upload sources map files to Bugsnag, you must set the following environment variables:
# - BUGSNAG_API_KEY
# - HOSTS: Comma separated list of hosts for the minifiedUrl field of Bugsnag API.
# - REPO_OWNER
# - REPO_NAME


BUGSNAG_API_URL="https://upload.bugsnag.com/"

upload_file() {
    local file="$1"

    # Split hosts string into an array of hosts.
    IFS=',' read -ra array_hosts <<< "$HOSTS"

    for host in "${array_hosts[@]}"; do
        echo "Uploading source map for $file.js to $host..."
        curl --http1.1 "$BUGSNAG_API_URL" \
            -F apiKey="$BUGSNAG_API_KEY" \
            -F minifiedUrl="https://$host/$file*.js" \
            -F sourceMap="@$PWD/js-sources-map/$file.js.map" \
            -F minifiedFile="@$PWD/js-sources-map/$file.js" \
            -F overwrite=true
    done
}

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

# Export map files to Bugsnag
echo "********************* Export map files to Bugsnag..."
if [[ -n "$BUGSNAG_API_KEY" && -n "$REPO_OWNER" && -n "$REPO_NAME" ]]; then
    echo "********************* Download latest available sources map artifact..."

    # Clean previous downloaded artifact
    rm $PWD/js-sources-map.zip
    rm -r $PWD/js-sources-map

    URL=https://nightly.link/$REPO_OWNER/$REPO_NAME/workflows/ci/${GIT_BRANCH:-master}/js-sources-map.zip
    echo "********************* Download url : $URL..."
    curl -L $URL -o $PWD/js-sources-map.zip
    unzip $PWD/js-sources-map.zip -d $PWD/js-sources-map/

    files=(main polyfills runtime quill)
    for file in "${files[@]}"; do
        upload_file $file
    done
else
    echo "********************* Bugsnag environment variables not set, skipping map export..."
fi

# Report new build
if [ ${DEPLOY_ENV:-prod} = "prod" ]; then
    echo "********************* Report build to error tracker..."
    git fetch --tags
    APP_VERSION=$(git describe --tags `git rev-list --tags --max-count=1`)
    yarn run report-build -k "${BUGSNAG_API_KEY}" -v "${APP_VERSION}" -s "production"
fi
