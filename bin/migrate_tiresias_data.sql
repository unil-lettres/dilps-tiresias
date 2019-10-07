-- This script will migrate from the old data structure to the new one.
-- It assumes that old tables and new tables are in the same database, side-by-side.
-- New tables must already exists and be up-to-date.
--
-- A quick way to ensure all those assumptions and do the migration are the following commands:
--
--     ./vendor/bin/doctrine-migrations migrations:migrate --no-interaction
--     echo 'RENAME TABLE news TO new_news;' | mysql -u dilps -p dilps
--     more data/cache/tiresias_dump.sql | mysql -u dilps -p dilps
--     echo 'RENAME TABLE news TO old_news; RENAME TABLE new_news TO news;' | mysql -u dilps -p dilps
--     more bin/migrate_tiresias_data.sql | mysql -u dilps -p dilps


-- Procedure to try as best as we can to explode concatenated ID and migrate them into proper FK
-- However some of those IDs don't exist anymore and will thus be ignored
DROP PROCEDURE IF EXISTS createRelationBetweenCollectionAndCard;
DELIMITER //

CREATE PROCEDURE createRelationBetweenCollectionAndCard()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE collectionId INT;
    DECLARE imageIds TEXT;
    DECLARE cur1 CURSOR FOR SELECT 4000 + id,
                                imageid
                            FROM panier
                            WHERE imageid != '';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur1;

    read_loop:
    LOOP
        FETCH cur1
            INTO collectionId, imageIds;
        IF done
        THEN
            LEAVE read_loop;
        END IF;

        -- Build a string like "(1, 2001),(2, 2001),(3, 2001)"
        SET @values = REPLACE(REPLACE(REPLACE(REPLACE(imageIds, 'x', ''), ' ', ''), '\n', ''), ',',
                              CONCAT(', ', collectionId, '),('));
        SET @values = CONCAT('(', @values, ', ', collectionId, ')');

        -- Debug
        SELECT @values;

        -- Build INSERT statement
        SET @insert = CONCAT('INSERT IGNORE INTO collection_card (card_id, collection_id) VALUES ', @values);

        -- Execute INSERT statement
        PREPARE stmt FROM @insert;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;


    END LOOP;

    CLOSE cur1;
END;
//

DELIMITER ;


START TRANSACTION;

-- Get offset to inset after existing data
SELECT IFNULL(MAX(id), 0)
INTO @artist_offset
FROM artist;

SELECT IFNULL(MAX(id), 0)
INTO @card_offset
FROM card;

SELECT IFNULL(MAX(id), 0)
INTO @change_offset
FROM `change`;

SELECT IFNULL(MAX(id), 0)
INTO @collection_offset
FROM collection;

SELECT IFNULL(MAX(id), 0)
INTO @country_offset
FROM country;

SELECT IFNULL(MAX(id), 0)
INTO @dating_offset
FROM dating;

SELECT IFNULL(MAX(id), 0)
INTO @institution_offset
FROM institution;

SELECT IFNULL(MAX(id), 0)
INTO @tag_offset
FROM tag;

SELECT IFNULL(MAX(id), 0)
INTO @user_offset
FROM user;

-- Migrate users into user
INSERT INTO user (id, creation_date, login, password, email, role, active_until, type, site)
SELECT id + @user_offset,
    creation_date,
    username,
    password,
    mail,
    CASE level
        WHEN 'superadministrateur'
            THEN 'administrator'
        WHEN 'administrateur'
            THEN 'senior'
        WHEN 'contributeur'
            THEN 'junior'
        WHEN 'scientifique'
            THEN 'junior'
        WHEN 'invité'
            THEN 'student'
        END,
    IF(valid_date = '', NULL, CONCAT(valid_date, '-01')),
    IF(type = 'externe', 'default', 'unil'),
    'tiresias'
FROM users;

-- Migrate periode into period
INSERT INTO period (id, name, `from`, `to`, sorting, parent_id)
SELECT id,
    periode,
    debut,
    fin,
    tri,
    IF(parentid = 0, NULL, parentid)
FROM periodes;

-- Migrate panier into collection
INSERT INTO collection (id, creation_date, name, visibility, site)
SELECT id + @collection_offset,
    date,
    nom,
    'private',
    'tiresias'
FROM panier;

-- Link collection to creator
UPDATE collection
    JOIN panier ON 4000 + panier.id = collection.id
    JOIN users ON users.id = panier.user
    JOIN user ON user.login = users.username
SET collection.owner_id   = user.id,
    collection.creator_id = user.id;

-- Migrate motscles into tag
INSERT INTO tag (id, name, parent_id, site)
SELECT id + @tag_offset,
    motcle,
    IF(parentid = 0, NULL, parentid + @tag_offset),
    'tiresias'
FROM motscles
ORDER BY parentid;

-- Migrate domaines into domain
INSERT INTO domain (id, name, parent_id)
SELECT id,
    domaine,
    IF(parentid = 0, NULL, parentid)
FROM domaines
ORDER BY parentid;

-- Migrate domaines into domain
INSERT INTO material (id, name, parent_id)
SELECT id,
    materiau,
    IF(parentid = 0, NULL, parentid)
FROM materiaux
ORDER BY parentid;

SELECT IFNULL(MAX(id), 0)
INTO @collection_offset_for_fonds
FROM collection;

INSERT INTO collection (id, name, description, copyrights, usage_rights, is_source, visibility, site)
SELECT id + @collection_offset_for_fonds,
    fond,
    description,
    IF(id IN (35, 34), TRIM(CONCAT(TRIM(proprietaire), ' ', copyright)),
       IF(id IN (2), TRIM(CONCAT(TRIM(proprietaire), ' © ', copyright)),
          copyright
           )
        ),
    droits,
    TRUE,
    'member',
    'tiresias'
FROM fonds;

INSERT INTO institution (id, name, locality, site)
SELECT musees.id + @institution_offset,
    -- Make institution name as unique as possible, according to https://support.ecodev.ch/issues/5779
    CONCAT(musees.musee, IF(city.city IS NOT NULL AND city.city != '', CONCAT(' - ', city.city), '')),
    city.city,
    'tiresias'
FROM musees
         LEFT JOIN city on musees.city_id = city.id;


INSERT INTO statistic (`date`, anonymous_page_count, default_page_count, unil_page_count, anonymous_search_count,
                       default_search_count, unil_search_count, anonymous_detail_count, default_detail_count,
                       unil_detail_count, default_login_count, unil_login_count, default_logins, unil_logins, site)
SELECT date,
    page_guest,
    page_ext,
    page_unil,
    search_guest,
    search_ext,
    search_unil,
    detail_guest,
    detail_ext,
    detail_unil,
    login_ext_tot,
    login_unil_tot,

    -- Transform into JSON
    CONCAT('[', REPLACE(TRIM(REPLACE(login_ext_users, '|', ' ')), ' ', ','), ']'),
    CONCAT('[', REPLACE(TRIM(REPLACE(login_unil_users, '|', ' ')), ' ', ','), ']'),
    'tiresias'
FROM stats
ORDER BY date;


INSERT INTO document_type(id, name)
SELECT id,
    restitutiontype
FROM restitutiontypes;

-- Fix our known countries
UPDATE country
SET name = 'Royaume-Uni'
WHERE code = 'GB';
UPDATE country
SET name = 'Palestine'
WHERE code = 'PS';
INSERT INTO country (code, name)
VALUES ('WB', 'Cisjordanie'); -- Here we use a made-up ISO code that is not affected to anything, see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

INSERT INTO card (id, filename, visibility, expanded_name, domain_id, document_type_id, technique_author,
                  technique_date, creation_date, update_date, creator_id, updater_id, latitude, longitude, `precision`,
                  institution_id, literature, isbn, object_reference, `from`, `to`, production_place,
                  locality, site)
SELECT meta.id + @card_offset,
    CONCAT('tiresias-', meta.id, '.jpg'),
    CASE statut
        WHEN 0
            THEN 'private'
        WHEN 1
            THEN 'member'
        WHEN 2
            THEN 'public'
        END,
    description,
    IF(d3_domaine IN (SELECT id FROM domain), d3_domaine,
       IF(d2_domaine IN (SELECT id FROM domain), d2_domaine,
          IF(d1_domaine IN (SELECT id FROM domain), d1_domaine,
             NULL
              )
           )
        ),
    IF(restitution_type IN (SELECT id FROM document_type), restitution_type, NULL),
    restitution_auteur,
    restitution_annee,
    insertion_date,
    edition_date,
    -- Migrate only the very few users that actually existed in old DB
    IF(insertion_utilisateur IN (SELECT id FROM users), insertion_utilisateur + @user_offset, NULL),
    IF(edition_utilisateur IN (SELECT id FROM users), edition_utilisateur + @user_offset, NULL),
    REPLACE(geo_latitude, '°', ''),
    REPLACE(geo_longitude, '°', ''),
    CASE geo_precision
        WHEN 'Localité'
            THEN 'locality'
        WHEN 'Bâtiment'
            THEN 'building'
        WHEN 'Site'
            THEN 'site'
        ELSE
            NULL
        END,
    IF(musee = 0, NULL, musee + @institution_offset),
    bibl_ref_image,
    bibl_ref_isbn_issn,
    bibl_ref_objet,
    IF(TRIM(t3_date_precise_debut) = '', NULL, REPLACE(t3_date_precise_debut, ' ', '')),
    IF(TRIM(t4_date_precise_fin) = '', NULL, REPLACE(t4_date_precise_fin, ' ', '')),
    m3_lieu_production,
    locality.lieu,
    'tiresias'
FROM meta
         LEFT JOIN lieux AS locality ON locality.id = l2_lieux;

-- Link card to their country by names
UPDATE card
    INNER JOIN meta ON meta.id + @card_offset = card.id
    INNER JOIN lieux ON lieux.id = meta.l1_lieux
    INNER JOIN country ON country.name = lieux.lieu
SET country_id = country.id;

-- Link card to material
INSERT INTO card_material (card_id, material_id)
SELECT img_id + @card_offset,
    mat_id
FROM matimg;

INSERT INTO card_period (card_id, period_id)
SELECT id + @card_offset,
    IF(t2_periode IN (SELECT id FROM periodes), t2_periode,
       IF(t1_civilisation IN (SELECT id FROM periodes), t1_civilisation,
          NULL)
        )
FROM meta
WHERE t2_periode IN (SELECT id FROM periodes) OR t1_civilisation IN (SELECT id FROM periodes);

-- Link card to tag
INSERT INTO card_tag (card_id, tag_id)
SELECT img_id + @card_offset,
    keyword_id + @tag_offset
FROM kwimg;

-- Link card to collection
INSERT INTO collection_card (collection_id, card_id)
SELECT fonds.id + @collection_offset_for_fonds,
    meta.id + @card_offset
FROM fonds
         INNER JOIN meta ON fonds.id = meta.fond;

INSERT INTO news (id, name, description, filename, url, sorting, site)
SELECT id,
    titre,
    description,
    CONCAT(image, '.jpg'),
    lien,
    tri,
    'tiresias'
FROM old_news;

INSERT INTO collection_user (user_id, collection_id)
SELECT user_id + @user_offset,
    fond_id + @collection_offset_for_fonds
FROM contributors
WHERE user_id IN (SELECT id FROM users) AND fond_id IN (SELECT id FROM fonds);


COMMIT;

DROP PROCEDURE createRelationBetweenCollectionAndCard;

-- Drop migrated tables
DROP TABLE `city`;
DROP TABLE `contributors`;
DROP TABLE `domaines`;
DROP TABLE `fonds`;
DROP TABLE `kwimg`;
DROP TABLE `lieux`;
DROP TABLE `login`;
DROP TABLE `materiaux`;
DROP TABLE `matimg`;
DROP TABLE `meta`;
DROP TABLE `motscles`;
DROP TABLE `musees`;
DROP TABLE `old_news`;
DROP TABLE `panier`;
DROP TABLE `periodes`;
DROP TABLE `restitutiontypes`;
DROP TABLE `stats`;
DROP TABLE `users`;
