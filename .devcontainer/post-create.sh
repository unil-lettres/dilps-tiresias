#!/bin/bash

echo "Waiting for composer dependencies to be installed..."
while [ ! -f ./vendor/autoload.php ]; do
    sleep 1
done

echo "Load dummy data & enable development mode..."
#php ./bin/load-test-data.php --no-interaction
#composer development-enable
