# Dilps/Tiresias

Master:
[![ci](https://github.com/unil-lettres/dilps-tiresias/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/unil-lettres/dilps-tiresias/actions/workflows/ci.yml)

Development:
[![ci](https://github.com/unil-lettres/dilps-tiresias/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/unil-lettres/dilps-tiresias/actions/workflows/ci.yml)

## Introduction

Dilps/Tiresias is a web application based on GraphQL for the API and Angular for the client.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/unil-lettres/dilps-tiresias)

## Installation

The recommended way to get a working copy is the following:

1. Set up a nginx virtual host to point to `htdocs/` directory and to include `configuration/nginx.conf`
2. Create a database in MariaDB named "dilps"
3. Configure database in `config/autoload/local.php` (see example `config/autoload/local.php.dist`)
4. Copy & rename the example.env file to .env (`cp example.env .env`). Replace the values if needed.
5. Finally, build the app:

`./bin/build.sh`

## Development with Docker

### Docker installation

A working [Docker](https://docs.docker.com/engine/install/) installation is mandatory.

### Environment files

Copy the following files:

```sh
cp example.env .env
cp dev/example.env dev/.env
cp config/development.config.php.dist config/development.config.php
cp config/autoload/local.php.dist config/autoload/local.php
cp config/autoload/tiresias.local.php.dist config/autoload/tiresias.local.php
cp config/autoload/development.local.php.dist config/autoload/development.local.php
```

You can replace the values if needed, but the default ones should work.

### Edit hosts file

Edit hosts file to point `dilps.docker` and `tiresias.docker` to your docker host.

### Environment installation & configuration

Run the following docker commands from the project root directory.

Build & run all the containers for this project:

`docker compose up` (add -d if you want to run in the background and silence the logs)

The project is compiled each time the containers are started. You'll get a **Build at** log message as soon as everything is ready to be used.

To load some dummy data & users, please run the following command:

`docker exec dilps-tiresias-app ./bin/load-test-data.php`

To access the application container (apache-php):

`docker exec -it dilps-tiresias-app bash`

Data for the mysql service is persisted using docker named volumes. You can see what volumes are currently present with:

`docker volume ls`

If you want to remove a volume (e.g. to start with a fresh database), you can use the following command.

`docker volume rm volume_name`

### Frontends

To access the main application please use the following links.

- [http://dilps.docker:8181](http://dilps.docker:8181) (administrator / administrator)
- [http://tiresias.docker:8181](http://tiresias.docker:8181) (administrator / administrator)

#### MailHog

To access mails please use the following link.

[http://dilps.docker:8027](http://dilps.docker:8027)

Or to get the messages in JSON format.

[http://dilps.docker:8027/api/v2/messages](http://dilps.docker:8027/api/v2/messages)

### Server

To switch the API to development (to enable logging), run:

`composer development-enable`

Logs will be available in `logs/all.log`.

#### Configuration caching

When in development mode, the configuration cache is
disabled, and switching in and out of development mode will remove the
configuration cache.

You may need to clear the configuration cache in production when deploying if
you deploy to the same directory. You may do so using the following:

`composer clear-config-cache`

## Testing

Like any PHP command, the PHP tests run in the application container. So do the Angular unit tests, because
`node_modules` holds the binaries for its system.

### PHPUnit

PHPUnit tests require a reference database dump. When the dump is loaded it **will destroy**
existing database. This must be done once before running tests. Then each test is ran
within a transaction which is rolled back, so the database state is always predictable.

To run PHPunit test:

```sh
docker compose exec dilps-tiresias-app ./bin/load-test-data.php
docker compose exec dilps-tiresias-app ./vendor/bin/phpunit # as many times as necessary
```

`docker compose exec dilps-tiresias-app composer check` runs PHP CS Fixer, PHPStan and then PHPUnit. The CI runs them
too, along with the Angular unit tests, `pnpm lint` and Prettier.

### Angular unit tests

The unit tests run via [Vitest](https://vitest.dev/), in Node with jsdom:

```sh
docker compose exec dilps-tiresias-app ./node_modules/.bin/ng test --watch=false

# Only some test files
docker compose exec dilps-tiresias-app ./node_modules/.bin/ng test --watch=false --include=client/app/card/card.utils.spec.ts
```

`pnpm test` also generates the GraphQL schema and types first, which the tests need, see `pnpm codegen`.

### End to end

Run `pnpm e2e` to execute the end-to-end tests via [Playwright](https://playwright.dev/). They are not run by CI.

They run on both sites, so they need the reference test data, see PHPUnit above. Each test creates and deletes its own
data. The Dilps site is `http://dilps.lan:4400/` by default, and the Tiresias site is the same URL with `dilps` replaced
by `tiresias`, unless given by `E2E_TIRESIAS_BASE_URL`. To run them against Docker, on the host:

```sh
npx playwright install chromium # once
E2E_BASE_URL=http://dilps.docker:8181/ npx playwright test --workers=2

# Only some test files, or only one site
E2E_BASE_URL=http://dilps.docker:8181/ npx playwright test e2e/card.spec.ts --project=dilps
```

More workers would overload the development server. `tiresias.spec.ts` only runs on Tiresias, `dialogs.spec.ts` runs
on both sites, and the other specs only run on Dilps, see `playwright.config.ts`.

Every test fails on any console error, uncaught error or GraphQL error, even if it does not look for them, see
`e2e/fixtures.ts`. So new tests must import `test` from `./fixtures`.

A known bug may be covered by a test of the expected behavior, marked `test.fail()` (or `it.fails` in unit tests), with
a comment describing the bug. Such a test fails as soon as the bug is fixed, as a reminder to remove the mark.

### Credits

This project is tested with
[BrowserStack](https://www.browserstack.com/).
