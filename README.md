# Dilps/Tiresias

Master: [![Build Status](https://github.com/unil-lettres/dilps-tiresias/workflows/ci/badge.svg?branch=master)](https://github.com/unil-lettres/dilps-tiresias/actions?query=branch%3Amaster) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/?branch=master)

Development: [![Build Status](https://github.com/unil-lettres/dilps-tiresias/workflows/ci/badge.svg?branch=develop)](https://github.com/unil-lettres/dilps-tiresias/actions?query=branch%3Adevelop) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/?branch=develop)

## Introduction

Dilps/Tiresias is a web application based on GraphQL for the API and Angular for the client.

## Installation

The recommended way to get a working copy is the following:

1. Set up a nginx virtual host to point to `htdocs/` directory and to include `configuration/nginx.conf`
2. Create a database in MariaDB named "dilps"
3. Configure database in `config/autoload/local.php` (see example `config/autoload/local.php.dist`)
4. Copy & rename the example.env file to .env (`cp example.env .env`). Replace the values if needed.
5. Finally, build the app:

```sh
./bin/build.sh
```

## Development with Docker

### Docker installation

A working [Docker](https://docs.docker.com/engine/install/) installation is mandatory.

### Environment files

Copy the following files:

```sh
cp example.env .env
cp dev/example.env dev/.env
cp config/autoload/local.php.dist config/autoload/local.php
cp config/autoload/tiresias.local.php.dist config/autoload/tiresias.local.php
```

You can replace the values if needed, but the default ones should work.

### Edit hosts file

Edit hosts file to point `dilps.docker` and `tiresias.docker` to your docker host.

### Environment installation & configuration

Run the following docker commands from the project root directory.

Build & run all the containers for this project:

`docker-compose up` (add -d if you want to run in the background and silence the logs)

The project is compiled each time the containers are started. You'll get a **Build at** log message as soon as everything is ready to be used.

To access the application container (apache-php):

```sh
docker exec -it dilps-tiresias-app bash
```

Data for the mysql service is persisted using docker named volumes. You can see what volumes are currently present with:

`docker volume ls`

If you want to remove a volume (e.g. to start with a fresh database), you can use the following command.

`docker volume rm volume_name`

### Frontends

To access the main application please use the following links.

- [http://dilps.docker:8181](http://dilps.docker:8181)
- [http://tiresias.docker:8181](http://tiresias.docker:8181)

#### phpMyAdmin

To access the database please use the following link.

[http://dilps.docker:9797](http://dilps.docker:9797)

- Server: dilps-tiresias-mysql
- Username: user
- Password: password

#### MailHog

To access mails please use the following link.

[http://dilps.docker:8027](http://dilps.docker:8027)

Or to get the messages in JSON format.

[http://dilps.docker:8027/api/v2/messages](http://dilps.docker:8027/api/v2/messages)

### Server

To switch the API to development (to enable logging), run:

```sh
composer development-enable
```

Logs will be available in `logs/all.log`.

#### Configuration caching

When in development mode, the configuration cache is
disabled, and switching in and out of development mode will remove the
configuration cache.

You may need to clear the configuration cache in production when deploying if
you deploy to the same directory. You may do so using the following:

```sh
composer clear-config-cache
```

## Testing

### PHPUnit

PHPUnit tests require a reference database dump. When the dump is loaded it **will destroy**
existing database. This must be done once before running tests. Then each test is ran
within a transaction which is rolled back, so the database state is always predictable.

To run PHPunit test:

```sh
./bin/load-test-data.php
./vendor/bin/phpunit # as many times as necessary
```

### Karma

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### End to end

Run `yarn e2e` to execute the end-to-end tests via [Playwright](https://playwright.dev/).
