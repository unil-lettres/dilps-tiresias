DELIMITER ~~

CREATE OR REPLACE PROCEDURE update_card_artists (IN card_id INT)
BEGIN

    UPDATE card LEFT JOIN (
        SELECT card_artist.card_id, IFNULL(GROUP_CONCAT(artist.name ORDER BY artist.id SEPARATOR '\n'), '') AS artists
        FROM card_artist
        INNER JOIN artist ON card_artist.artist_id = artist.id
        WHERE card_artist.card_id = card_id
        GROUP BY card_artist.card_id
    ) AS tmp ON card.id = tmp.card_id
    SET cached_artist_names = IFNULL(tmp.artists, '')
    WHERE card.id = card_id
    ;
END ~~

CREATE OR REPLACE TRIGGER card_artist_after_insert
    AFTER INSERT
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists(NEW.card_id);
END; ~~

CREATE OR REPLACE TRIGGER card_artist_after_update
    AFTER UPDATE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists(OLD.card_id);
    CALL update_card_artists(NEW.card_id);
END; ~~

CREATE OR REPLACE TRIGGER card_artist_after_delete
    AFTER DELETE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists(OLD.card_id);
END; ~~


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

        CALL update_card_artists(card_id);
    END LOOP;

    CLOSE cur;

END; ~~

CREATE OR REPLACE TRIGGER artist_before_delete
    BEFORE DELETE
    ON artist
    FOR EACH ROW
BEGIN
    CREATE TEMPORARY TABLE IF NOT EXISTS updated_card (id INT);
    INSERT INTO updated_card (id) SELECT card_artist.card_id FROM card_artist WHERE artist_id = OLD.id;
END; ~~

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

        CALL update_card_artists(card_id);
    END LOOP;

    CLOSE cur;

    DELETE FROM updated_card;
END; ~~


DELIMITER ;
