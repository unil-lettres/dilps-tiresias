#!/usr/bin/env bash

# Delete exported files older than 3 days
find ./htdocs/export -type f ! -iname '.gitkeep' -mtime +3 -delete
