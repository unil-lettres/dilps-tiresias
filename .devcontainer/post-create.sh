#!/bin/bash

echo "Waiting for the container to be healthy..."
while ! /usr/local/bin/healthcheck-php-fpm.sh; do
    sleep 1
done

echo "Load dummy data & enable development mode..."
php ./bin/load-test-data.php --no-interaction
composer development-enable

echo "Set permissions for ORM cache directory..."
chmod 777 -R ./data/cache/DoctrineORMModule
