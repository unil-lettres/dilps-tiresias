#!/bin/bash

cp .env.example .env
cp dev/app.env.example dev/app.env
cp dev/db.env.example dev/db.env
cp config/development.config.php.dist config/development.config.php
cp config/autoload/local.php.dist config/autoload/local.php
cp config/autoload/tiresias.local.php.dist config/autoload/tiresias.local.php
cp config/autoload/development.local.php.dist config/autoload/development.local.php
