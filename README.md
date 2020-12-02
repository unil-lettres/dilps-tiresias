# Dilps/Tiresias

Master: [![Build Status](https://travis-ci.com/unil-lettres/dilps-tiresias.svg?branch=master)](https://travis-ci.com/unil-lettres/dilps) [![Build Status](https://github.com/unil-lettres/dilps-tiresias/workflows/main/badge.svg)](https://github.com/unil-lettres/dilps-tiresias/actions) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/?branch=master)

Development: [![Build Status](https://travis-ci.com/unil-lettres/dilps-tiresias.svg?branch=develop)](https://travis-ci.com/unil-lettres/dilps) [![Build Status](https://github.com/unil-lettres/dilps-tiresias/workflows/main/badge.svg?branch=develop)](https://github.com/unil-lettres/dilps-tiresias/actions) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/unil-lettres/dilps-tiresias/?branch=develop)

## Introduction

Dilps/Tiresias is a web application based on GraphQL for the API and Angular for the client.

## Installation

The recommended way to get a working copy is the following:

1. Set up a nginx virtual host to point to `htdocs/` directory and to include `configuration/nginx.conf`
2. Create a database in MariaDB named "dilps"
3. Configure database in `config/autoload/local.php` (see example `config/autoload/local.php.dist`)
4. Copy & rename the example.env file to .env (`cp env.example .env`). Replace the values if needed.
5. Finally, build the app:

```sh
./bin/build.sh
```

## Development

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
$ composer clear-config-cache
```

### Client

Run `yarn dev` for a dev server. Navigate to `http://dilps.lan:4400/`. The app will
automatically reload if you change any of the source files.

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

### Protractor

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
