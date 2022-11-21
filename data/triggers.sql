DELIMITER ~~

CREATE OR REPLACE PROCEDURE update_card_artists ()
BEGIN

    UPDATE card LEFT JOIN (
        SELECT card_artist.card_id, IFNULL(GROUP_CONCAT(artist.name ORDER BY artist.id SEPARATOR '\n'), '') AS artists FROM card_artist
        INNER JOIN artist ON card_artist.artist_id = artist.id
        GROUP BY card_artist.card_id
    ) AS tmp ON card.id = tmp.card_id
    SET cached_artist_names = IFNULL(tmp.artists, '')
    ;
END ~~

CREATE OR REPLACE TRIGGER card_artist_after_insert
    AFTER INSERT
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists();
END; ~~

CREATE OR REPLACE TRIGGER card_artist_after_update
    AFTER UPDATE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists();
END; ~~

CREATE OR REPLACE TRIGGER card_artist_after_delete
    AFTER DELETE
    ON card_artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists();
END; ~~


CREATE OR REPLACE TRIGGER artist_after_update
    AFTER UPDATE
    ON artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists();
END; ~~

CREATE OR REPLACE TRIGGER artist_after_delete
    AFTER DELETE
    ON artist
    FOR EACH ROW
BEGIN
    CALL update_card_artists();
END; ~~


DELIMITER ;
