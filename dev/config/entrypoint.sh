#!/bin/sh

set -e

# run the dilps/tiresias build script
/var/www/bin/build.sh

# create or replace procedures & triggers
mariadb -D $MYSQL_DATABASE -u $MYSQL_USER -p$MYSQL_PASSWORD < "/var/www/data/triggers.sql"

# run commands from dockerfile
"${@}"
