#!/bin/sh

set -e

# run the dilps/tiresias build script
sh /var/www/bin/build.sh

# create or replace procedures & triggers
mysql -D $MYSQL_DATABASE -u $MYSQL_USER -p$MYSQL_PASSWORD < "/var/www/data/triggers.sql"

# run commands from dockerfile
"${@}"
