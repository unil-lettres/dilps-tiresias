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
INSERT INTO user (id, creation_date, name, login, password, email, role, active_until, type, site)
SELECT id + @user_offset,
    creation_date,
    name,
    IF(type = 'externe', username, CONCAT('-unil-', username)),
    password,
    IF(TRIM(mail) = '' OR users.id = 88, NULL, TRIM(mail)),
    CASE level
        WHEN 'superadministrateur'
            THEN 'administrator'
        WHEN 'administrateur'
            THEN 'major'
        WHEN 'contributeur'
            THEN 'junior'
        WHEN 'scientifique'
            THEN 'student'
        WHEN 'invité'
            THEN 'student'
        END,
    IF(valid_date = '', NULL, CONCAT(valid_date, '-01')),
    IF(type = 'externe', 'default', 'aai'),
    'tiresias'
FROM users;

-- Migrate periode into period
INSERT INTO period (id, name, `from`, `to`, sorting, parent_id, site)
SELECT id,
    TRIM(periode),
    debut,
    fin,
    tri,
    IF(parentid = 0, NULL, parentid),
    'tiresias'
FROM periodes;

-- Root periods are all sorted by names
UPDATE period SET sorting = 0 WHERE parent_id IS NULL AND site = 'tiresias';

-- Migrate panier into collection
INSERT INTO collection (id, creation_date, name, visibility, site)
SELECT id + @collection_offset,
    date,
    TRIM(nom),
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
    TRIM(motcle),
    IF(parentid = 0, NULL, parentid + @tag_offset),
    'tiresias'
FROM motscles
ORDER BY parentid;

-- Migrate domaines into domain
INSERT INTO domain (id, name, parent_id, site)
SELECT id,
    TRIM(domaine),
    IF(parentid = 0, NULL, parentid),
    'tiresias'
FROM domaines
ORDER BY parentid;

-- Migrate domaines into domain
INSERT INTO material (id, name, parent_id, site)
SELECT id,
    TRIM(materiau),
    IF(parentid = 0, NULL, parentid),
    'tiresias'
FROM materiaux
ORDER BY parentid;

SELECT IFNULL(MAX(id), 0)
INTO @collection_offset_for_fonds
FROM collection;

INSERT INTO collection (id, name, description, copyrights, usage_rights, is_source, visibility, site)
SELECT id + @collection_offset_for_fonds,
    TRIM(fond),
    TRIM(description),
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

INSERT IGNORE INTO institution (id, name, locality, site)
SELECT musees.id + @institution_offset,
    -- Make institution name as unique as possible, according to https://support.ecodev.ch/issues/5779
    TRIM(CONCAT(REPLACE(REPLACE(musees.musee, '<i>', ''), '</i>', ''), IF(city.city IS NOT NULL AND city.city != '', CONCAT(' - ', city.city), ''))),
    city.city,
    'tiresias'
FROM musees
         LEFT JOIN city on musees.city_id = city.id;


INSERT INTO statistic (`date`, anonymous_page_count, default_page_count, aai_page_count, anonymous_search_count,
                       default_search_count, aai_search_count, anonymous_detail_count, default_detail_count,
                       aai_detail_count, default_login_count, aai_login_count, default_logins, aai_logins, site)
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


INSERT INTO document_type(id, name, site)
SELECT id,
    TRIM(restitutiontype),
    'tiresias'
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

INSERT INTO card (id, filename, visibility, name, expanded_name, domain_id, document_type_id, technique_author,
                  technique_date, creation_date, update_date, creator_id, updater_id, location, `precision`,
                  literature, isbn, object_reference, `from`, `to`, production_place,
                  locality, site, url, url_description, width, height, code, legacy_id)
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
    -- Extract name from description
    TRIM(
            REPLACE(
                    REPLACE(
                            REPLACE(
                                    REPLACE(
                                            REPLACE(
                                                    REPLACE(
                                                            REPLACE(
                                                                    REPLACE(
                                                                            REPLACE(
                                                                                    REPLACE(
                                                                                            REGEXP_SUBSTR(meta.description, '\\[t\\].*\\[/t\\]'),
                                                                                            '[t]',
                                                                                            ''),
                                                                                    '[/t].',
                                                                                    ''),
                                                                            '[/t]',
                                                                            ''),
                                                                    '[b]',
                                                                    '<strong>'),
                                                            '[/b]',
                                                            '</strong>'),
                                                    '[i]',
                                                    '<em>'),
                                            '[/i]',
                                            '</em>'),
                                    '[u]',
                                    '<span style="text-decoration: underline;">'),
                            '[/u]',
                            '</span>'),
                    '[nl]',
                    '<br>')
        ),
    -- Remove name from description
    TRIM(
            REPLACE(
                    REPLACE(
                            REPLACE(
                                    REPLACE(
                                            REPLACE(
                                                    REPLACE(
                                                            REPLACE(
                                                                    REPLACE(
                                                                            REPLACE(
                                                                                    meta.description,
                                                                                    '[t]',
                                                                                    ''),
                                                                            '[/t]',
                                                                            ''),
                                                                    '[b]',
                                                                    '<strong>'),
                                                            '[/b]',
                                                            '</strong>'),
                                                    '[i]',
                                                    '<em>'),
                                            '[/i]',
                                            '</em>'),
                                    '[u]',
                                    '<span style="text-decoration: underline;">'),
                            '[/u]',
                            '</span>'),
                    '[nl]',
                    '<br>')
        ),
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
    IF(insertion_date > '1990-01-01', insertion_date, NULL),
    IF(edition_date > '1990-01-01', edition_date, NULL),
    -- Migrate only the very few users that actually existed in old DB
    IF(insertion_utilisateur IN (SELECT id FROM users), insertion_utilisateur + @user_offset, NULL),
    IF(edition_utilisateur IN (SELECT id FROM users), edition_utilisateur + @user_offset, NULL),
    IF(
        REPLACE(geo_longitude, '°', '') != '' AND REPLACE(geo_latitude, '°', '') != '',
        ST_PointFromText(CONCAT('POINT(', REPLACE(geo_longitude, '°', '') ,' ', REPLACE(geo_latitude, '°', ''),')')),
        NULL
    ),
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
    REPLACE(
            REPLACE(
                    REPLACE(
                            REPLACE(
                                    REPLACE(
                                            REPLACE(
                                                    REPLACE(
                                                            bibl_ref_image,
                                                            '[b]',
                                                            '<strong>'),
                                                    '[/b]',
                                                    '</strong>'),
                                            '[i]',
                                            '<em>'),
                                    '[/i]',
                                    '</em>'),
                            '[u]',
                            '<span style="text-decoration: underline;">'),
                    '[/u]',
                    '</span>'),
            '[nl]',
            '<br>'),
    bibl_ref_isbn_issn,
    bibl_ref_objet,
    IF(TRIM(t3_date_precise_debut) = '', NULL, REPLACE(t3_date_precise_debut, ' ', '')),
    IF(TRIM(t4_date_precise_fin) = '', NULL, REPLACE(t4_date_precise_fin, ' ', '')),
    m3_lieu_production,
    locality.lieu,
    'tiresias',
    url_http,
    url_description,
    200,
    200,
    CONCAT(fonds.fond, '-', meta.id),
    meta.id
FROM meta
         INNER JOIN fonds ON meta.fond = fonds.id
         LEFT JOIN lieux AS locality ON locality.id = l2_lieux;

-- Link card to their institution by names
UPDATE card
    INNER JOIN meta ON meta.id + @card_offset = card.id
    INNER JOIN musees ON musees.id = meta.musee
    LEFT JOIN city ON musees.city_id = city.id
    INNER JOIN institution ON institution.site = 'tiresias'
        AND institution.name =
            TRIM(CONCAT(musees.musee, IF(city.city IS NOT NULL AND city.city != '', CONCAT(' - ', city.city), '')))
SET card.institution_id = institution.id;

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
INSERT INTO card_collection (collection_id, card_id)
SELECT fonds.id + @collection_offset_for_fonds,
    meta.id + @card_offset
FROM fonds
         INNER JOIN meta ON fonds.id = meta.fond;

INSERT INTO news (id, name, description, filename, url, sorting, site)
SELECT id,
    TRIM(titre),
    TRIM(description),
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
