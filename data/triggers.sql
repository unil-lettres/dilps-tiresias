DELIMITER ~~

CREATE OR REPLACE PROCEDURE update_artist_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_artist WHERE card_artist.artist_id = input_id INTO @count;
    UPDATE artist SET usage_count = @count WHERE artist.id = input_id;
END ~~

CREATE OR REPLACE PROCEDURE update_card_cached_artist_names(IN card_id INT)
BEGIN

    UPDATE card LEFT JOIN (
        SELECT card_artist.card_id, IFNULL(GROUP_CONCAT(artist.name ORDER BY artist.id SEPARATOR '\n'), '') AS artists
        FROM card_artist
        INNER JOIN artist ON card_artist.artist_id = artist.id
        WHERE card_artist.card_id = card_id
        GROUP BY card_artist.card_id
    ) AS tmp ON card.id = tmp.card_id
    SET cached_artist_names = IFNULL(tmp.artists, '')
    WHERE card.id = card_id;
END ~~

CREATE OR REPLACE TRIGGER card_artist_after_insert
    AFTER INSERT
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_cached_artist_names(NEW.card_id);
    CALL update_artist_usage_count(NEW.artist_id);
END ~~

CREATE OR REPLACE TRIGGER card_artist_after_update
    AFTER UPDATE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_cached_artist_names(OLD.card_id);
    CALL update_card_cached_artist_names(NEW.card_id);
    CALL update_artist_usage_count(OLD.artist_id);
    CALL update_artist_usage_count(NEW.artist_id);
END ~~

CREATE OR REPLACE TRIGGER card_artist_after_delete
    AFTER DELETE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_cached_artist_names(OLD.card_id);
    CALL update_artist_usage_count(OLD.artist_id);
END ~~


CREATE OR REPLACE TRIGGER artist_after_update
    AFTER UPDATE
    ON artist
    FOR EACH ROW
BEGIN

    DECLARE done INT DEFAULT FALSE;
    DECLARE card_id INT;
    DECLARE cur CURSOR FOR SELECT card_artist.card_id
                           FROM card_artist
                           WHERE card_artist.artist_id = NEW.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop:
    LOOP
        FETCH cur INTO card_id;

        IF done
        THEN
            LEAVE read_loop;
        END IF;

        CALL update_card_cached_artist_names(card_id);
    END LOOP;

    CLOSE cur;

END ~~

CREATE OR REPLACE TRIGGER artist_before_delete
    BEFORE DELETE
    ON artist
    FOR EACH ROW
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS updated_card (id INT);
    INSERT INTO updated_card (id) SELECT card_artist.card_id FROM card_artist WHERE artist_id = OLD.id;
END ~~

CREATE OR REPLACE TRIGGER artist_after_delete
    AFTER DELETE
    ON artist
    FOR EACH ROW
BEGIN

    DECLARE done INT DEFAULT FALSE;
    DECLARE card_id INT;
    DECLARE cur CURSOR FOR SELECT id FROM updated_card;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop:
    LOOP
        FETCH cur INTO card_id;

        IF done
        THEN
            LEAVE read_loop;
        END IF;

        CALL update_card_cached_artist_names(card_id);
    END LOOP;

    CLOSE cur;

    DELETE FROM updated_card;
END ~~

CREATE OR REPLACE PROCEDURE update_antique_name_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_antique_name WHERE card_antique_name.antique_name_id = input_id INTO @count;
    UPDATE antique_name SET usage_count = @count WHERE antique_name.id = input_id;
END ~~

CREATE OR REPLACE TRIGGER card_antique_name_after_insert
    AFTER INSERT
    ON card_antique_name
    FOR EACH ROW
BEGIN
    CALL update_antique_name_usage_count(NEW.antique_name_id);
END ~~

CREATE OR REPLACE TRIGGER card_antique_name_after_update
    AFTER UPDATE
    ON card_antique_name
    FOR EACH ROW
BEGIN
    CALL update_antique_name_usage_count(OLD.antique_name_id);
    CALL update_antique_name_usage_count(NEW.antique_name_id);
END ~~

CREATE OR REPLACE TRIGGER card_antique_name_after_delete
    AFTER DELETE
    ON card_antique_name
    FOR EACH ROW
BEGIN
    CALL update_antique_name_usage_count(OLD.antique_name_id);
END ~~

CREATE OR REPLACE PROCEDURE update_domain_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_domain WHERE card_domain.domain_id = input_id INTO @count;
    UPDATE domain SET usage_count = @count WHERE domain.id = input_id;
END ~~

CREATE OR REPLACE TRIGGER card_domain_after_insert
    AFTER INSERT
    ON card_domain
    FOR EACH ROW
BEGIN
    CALL update_domain_usage_count(NEW.domain_id);
END ~~

CREATE OR REPLACE TRIGGER card_domain_after_update
    AFTER UPDATE
    ON card_domain
    FOR EACH ROW
BEGIN
    CALL update_domain_usage_count(OLD.domain_id);
    CALL update_domain_usage_count(NEW.domain_id);
END ~~

CREATE OR REPLACE TRIGGER card_domain_after_delete
    AFTER DELETE
    ON card_domain
    FOR EACH ROW
BEGIN
    CALL update_domain_usage_count(OLD.domain_id);
END ~~

CREATE OR REPLACE PROCEDURE update_material_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_material WHERE card_material.material_id = input_id INTO @count;
    UPDATE material SET usage_count = @count WHERE material.id = input_id;
END ~~

CREATE OR REPLACE TRIGGER card_material_after_insert
    AFTER INSERT
    ON card_material
    FOR EACH ROW
BEGIN
    CALL update_material_usage_count(NEW.material_id);
END ~~

CREATE OR REPLACE TRIGGER card_material_after_update
    AFTER UPDATE
    ON card_material
    FOR EACH ROW
BEGIN
    CALL update_material_usage_count(OLD.material_id);
    CALL update_material_usage_count(NEW.material_id);
END ~~

CREATE OR REPLACE TRIGGER card_material_after_delete
    AFTER DELETE
    ON card_material
    FOR EACH ROW
BEGIN
    CALL update_material_usage_count(OLD.material_id);
END ~~

CREATE OR REPLACE PROCEDURE update_period_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_period WHERE card_period.period_id = input_id INTO @count;
    UPDATE period SET usage_count = @count WHERE period.id = input_id;
END ~~

CREATE OR REPLACE TRIGGER card_period_after_insert
    AFTER INSERT
    ON card_period
    FOR EACH ROW
BEGIN
    CALL update_period_usage_count(NEW.period_id);
END ~~

CREATE OR REPLACE TRIGGER card_period_after_update
    AFTER UPDATE
    ON card_period
    FOR EACH ROW
BEGIN
    CALL update_period_usage_count(OLD.period_id);
    CALL update_period_usage_count(NEW.period_id);
END ~~

CREATE OR REPLACE TRIGGER card_period_after_delete
    AFTER DELETE
    ON card_period
    FOR EACH ROW
BEGIN
    CALL update_period_usage_count(OLD.period_id);
END ~~


CREATE OR REPLACE PROCEDURE update_tag_usage_count(IN input_id INT)
BEGIN
    SELECT COUNT(*) FROM card_tag WHERE card_tag.tag_id = input_id INTO @count;
    UPDATE tag SET usage_count = @count WHERE tag.id = input_id;
END ~~

CREATE OR REPLACE TRIGGER card_tag_after_insert
    AFTER INSERT
    ON card_tag
    FOR EACH ROW
BEGIN
    CALL update_tag_usage_count(NEW.tag_id);
END ~~

CREATE OR REPLACE TRIGGER card_tag_after_update
    AFTER UPDATE
    ON card_tag
    FOR EACH ROW
BEGIN
    CALL update_tag_usage_count(OLD.tag_id);
    CALL update_tag_usage_count(NEW.tag_id);
END ~~

CREATE OR REPLACE TRIGGER card_tag_after_delete
    AFTER DELETE
    ON card_tag
    FOR EACH ROW
BEGIN
    CALL update_tag_usage_count(OLD.tag_id);
END;


CREATE OR REPLACE PROCEDURE update_institution_usage_count(IN input_id INT)
BEGIN
    IF input_id IS NOT NULL
    THEN
        SELECT COUNT(*) FROM card WHERE card.institution_id = input_id INTO @count;
        UPDATE institution SET usage_count = @count WHERE institution.id = input_id;
    END IF;
END ~~

CREATE OR REPLACE PROCEDURE update_document_type_usage_count(IN input_id INT)
BEGIN
    IF input_id IS NOT NULL
    THEN
        SELECT COUNT(*) FROM card WHERE card.document_type_id = input_id INTO @count;
        UPDATE document_type SET usage_count = @count WHERE document_type.id = input_id;
    END IF;
END ~~

CREATE OR REPLACE TRIGGER card_after_insert
    AFTER INSERT
    ON card
    FOR EACH ROW
BEGIN
    CALL update_institution_usage_count(NEW.institution_id);
    CALL update_document_type_usage_count(NEW.document_type_id);
END ~~

CREATE OR REPLACE TRIGGER card_after_update
    AFTER UPDATE
    ON card
    FOR EACH ROW
BEGIN
    CALL update_institution_usage_count(OLD.institution_id);
    CALL update_institution_usage_count(NEW.institution_id);
    CALL update_document_type_usage_count(OLD.document_type_id);
    CALL update_document_type_usage_count(NEW.document_type_id);
END ~~

CREATE OR REPLACE TRIGGER card_after_delete
    AFTER DELETE
    ON card
    FOR EACH ROW
BEGIN
    CALL update_institution_usage_count(OLD.institution_id);
    CALL update_document_type_usage_count(OLD.document_type_id);
END ~~
DELIMITER ;
