-- This script will generate a bash script to move files from their old location to the new one.
-- This script should be used on the old DB. And the generated bash script might be manually tweaked
-- and executed at a later time, most likely just before/right after the switch to production of the new app.
--
-- Typical usage would be:
--
--     more bin/generate-script-to-migrate-files.sql | mysql --raw -u dilps -p dilps

SELECT CONCAT('cp "medias/', fond, '/cache/', id, '.jpg" "data/images/tiresias-', id, '.jpg"') AS '#!/usr/bin/env bash'
FROM meta
ORDER BY fond, id;
