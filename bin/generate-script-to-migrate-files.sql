-- This script will generate a bash script to move files from their old location to the new one.
-- This script should be used on the old DB. And the generated bash script might be manually tweaked
-- and executed at a later time, most likely just before/right after the switch to production of the new app.
--
-- Typical usage would be:
--
--     more bin/generate-script-to-migrate-files.sql | mysql --raw -u {user} -p {database} > migrate-tiresias-data.sh

SELECT CONCAT('cp "/path/to/input/data/', fonds.fond, '/cache/', meta.id, '.jpg" "/path/to/output/data/tiresias-', meta.id, '.jpg"') AS '#!/usr/bin/env bash'
FROM meta
JOIN fonds ON meta.fond = fonds.id
ORDER BY meta.fond, meta.id;
