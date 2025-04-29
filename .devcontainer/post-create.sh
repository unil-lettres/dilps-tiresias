#!/bin/bash

echo "Waiting for composer dependencies to be installed..."
# This is needed to load the test data & enable development mode
#while [ ! -f ./vendor/autoload.php ]; do
#    sleep 1
#done
#
#php ./bin/load-test-data.php --no-interaction
#composer development-enable
