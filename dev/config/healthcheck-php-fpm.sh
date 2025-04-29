#!/bin/bash

if supervisorctl status php_fpm | grep -q "RUNNING"; then
  exit 0
else
  exit 1
fi
