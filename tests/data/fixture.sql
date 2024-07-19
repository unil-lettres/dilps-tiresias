START TRANSACTION;

SET sql_mode = 'STRICT_TRANS_TABLES';

REPLACE INTO `collection` (`id`, parent_id, is_source, owner_id, visibility, copyrights, usage_rights, `name`, `description`, `site`) VALUES
  (2000, NULL, 1, 1003, 'private', '© ACME', 'Only if you ask nicely', 'Test collection 2000', 'Roads? Where we''re going we don''t need roads.', 'dilps'),
  (2001, NULL, 0, NULL, 'member', '', '', 'Test collection 2001', 'Hello. My name is Inigo Montoya. You killed my father. Prepare to die.', 'dilps'),
  (2002, NULL, 0, 1002, 'member', '', '', 'Test collection 2002', 'You''re gonna need a bigger boat.', 'dilps'),
  (2003, NULL, 0, 1007, 'private', '', '', 'Test collection 2003', 'Roads? Where we''re going we don''t need roads.', 'tiresias'),
  (2004, NULL, 0, NULL, 'member', '', '', 'Test collection 2004', 'Hello. My name is Inigo Montoya. You killed my father. Prepare to die.', 'tiresias'),
  (2005, NULL, 0, 1006, 'member', '', '', 'Test collection 2005', 'You''re gonna need a bigger boat.', 'tiresias'),
  (2006, 2000, 0, 1003, 'member', '', '', 'Test collection 2006 child of 2000', 'I''m the king of the world!', 'dilps'),
  (2007, 2001, 0, 1003, 'member', '', '', 'Test collection 2007 child of 2001', 'My mama always said life was like a box of chocolates.', 'dilps'),
  (2008, 2001, 0, 1003, 'private', '', '', 'Test collection 2008 child of 2001', 'It is not our abilities that show what we truly are. It is our choices.', 'dilps');

REPLACE INTO `artist` (`id`, `name`, `site`, usage_count) VALUES
(3000, 'Test artist 3000', 'dilps', 2),
(3001, 'Test artist 3001', 'dilps', 2);

REPLACE INTO `tag` (`id`, `parent_id`, `name`, `site`, usage_count) VALUES
  (4000, NULL, 'Test root tag 4000', 'dilps', 1),
  (4001, 4000, 'Test child tag 40001', 'dilps', 0),
  (4002, NULL, 'Test root tag 4002', 'tiresias', 0),
  (4003, 4002, 'Test child tag 4003', 'tiresias', 0),
  (4004, NULL, 'Test root tag 4004', 'dilps', 0),
  (4005, 4004, 'Test child tag 4005', 'dilps', 0);

REPLACE INTO `institution` (`id`, `country_id`, `name`, `site`) VALUES
  (5000, 1, 'Test institution 5000', 'dilps'),
  (5001, 1, 'Test institution 5001', 'tiresias');

REPLACE INTO `card` (`id`, owner_id, creator_id, `original_id`, visibility, site, `name`, `filename`, `width`, `height`, `file_size`, `dating`, `location`, `precision`) VALUES
  (6000, 1003, 1003, NULL, 'private', 'dilps', 'Test card 6000', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '2000', ST_PointFromText('POINT(6.9301 46.9937969)'), NULL),
  (6001, 1003, 1003, NULL, 'private', 'dilps', 'Test suggestion card 6001', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(6.5779666 46.5210895)'), NULL),
  (6002, 1003, 1003, 6000, 'private', 'dilps', 'Test suggestion card 6002', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(6.5814212 46.5214586)'), NULL),
  (6003, 1003, 1003, NULL, 'private', 'dilps', 'Test card 6003', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(6.5832964 46.5219361)'), NULL),
  (6004, 1003, 1003, 6000, 'member', 'dilps', 'Test card 6004', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(-8.6570586 41.1621376)'), NULL),
  (6005, NULL, NULL, 6000, 'public', 'dilps', 'Test related card 6005', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(151.2131027 -33.8567844)'), NULL),
  (6006, 1002, 1002, NULL, 'member', 'dilps', 'Test junior card 6006', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', ST_PointFromText('POINT(-73.9675491 40.7828647)'), NULL),
  (6007, 1007, 1007, NULL, 'private', 'tiresias', 'Test card 6007', '5da49355cbcff.jpeg', 1950, 1300, 90188, '2000', ST_PointFromText('POINT(12.4917557 41.8906832)'), 'site'),
  (6008, 1007, 1007, NULL, 'private', 'tiresias', 'Test suggestion card 6008', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4917557 41.8906842)'), 'site'),
  (6009, 1007, 1007, 6007, 'private', 'tiresias', 'Test suggestion card 6009', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4917567 41.8906832)'), 'site'),
  (6010, 1007, 1007, NULL, 'private', 'tiresias', 'Test card 6010', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4917557 41.8906822)'), 'site'),
  (6011, 1007, 1007, 6007, 'member', 'tiresias', 'Test card 6011', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4917547 41.8906832)'), 'site'),
  (6012, NULL, NULL, 6007, 'public', 'tiresias', 'Test related card 6012', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4917557 41.8916832)'), 'site'),
  (6013, 1006, 1006, NULL, 'member', 'tiresias', 'Test junior card 6013', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', ST_PointFromText('POINT(12.4927557 41.8906832)'), 'site');

REPLACE INTO `card_artist` (`card_id`, `artist_id`) VALUES
(6000, 3000),
(6000, 3001),
(6001, 3000),
(6002, 3001);

REPLACE INTO `card_tag` (`card_id`, `tag_id`) VALUES
  (6000, 4000);

REPLACE INTO `card_collection` (`collection_id`, `card_id`) VALUES
  (2000, 6000),
  (2001, 6001),
  (2001, 6002);

REPLACE INTO `change` (`id`, `original_id`, `suggestion_id`, `type`, `request`, `site`) VALUES
  (7000, NULL, 6001, 'create', 'I want to add new card to collection', 'dilps'),
  (7001, 6000, 6002, 'update', 'I want to edit existing card', 'dilps'),
  (7002, 6000, NULL, 'delete', 'I want to delete existing card', 'dilps'),
  (7003, NULL, 6008, 'create', 'I want to add new card to collection', 'tiresias'),
  (7004, 6007, 6009, 'update', 'I want to edit existing card', 'tiresias'),
  (7005, 6007, NULL, 'delete', 'I want to delete existing card', 'tiresias');

REPLACE INTO `dating` (`id`, `card_id`, `from`, `to`) VALUES
  (8000, 6000, '2451545', '2451545');

REPLACE INTO `card_card` (`card_source`, `card_target`) VALUES
  (6000, 6005),
  (6005, 6000);

REPLACE INTO `period` (`id`, `parent_id`, `name`, `site`) VALUES
  (7000, NULL, 'Test root period 7000', 'tiresias'),
  (7001, 7000, 'Test child period 7001', 'tiresias');

REPLACE INTO `material` (`id`, `parent_id`, `name`, `site`) VALUES
  (8000, NULL, 'Test root material 8000', 'tiresias'),
  (8001, 8000, 'Test child material 8001', 'tiresias');

REPLACE INTO `domain` (`id`, `name`, `site`) VALUES
  (9000, 'Test domain 9000', 'tiresias'),
  (9001, 'Test domain 9001', 'tiresias');

REPLACE INTO `document_type` (`id`, `name`, `site`) VALUES
  (11000, 'Test document type 11000', 'tiresias'),
  (11001, 'Test document type 11001', 'tiresias');

REPLACE INTO `news` (`id`, `site`, is_active, `name`, `description`, url, filename) VALUES
  (10000, 'tiresias', 1,  'Test news 10000', 'Donec ullamcorper nulla non metus auctor fringilla. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'https://example.com', 'test1.jpg'),
  (10001, 'tiresias', 1, 'Test news 10001', 'Curabitur blandit tempus porttitor. Donec sed odio dui.', 'https://google.com', 'test2.jpg'),
  (10002, 'dilps', 1, 'Test news 10002', 'This human feeds me, i should be a god lick plastic bags instantly break out into full speed gallop across the house for no reason attack the dog then pretend like nothing happened yet so you''re just gonna scroll by without saying meowdy?', 'https://example.com', 'test1.jpg'),
  (10003, 'dilps', 1, 'Test news 10003', 'That box? i can fit in that box. If human is on laptop sit on the keyboard eat too much then proceed to regurgitate all over living room carpet while humans eat dinner.', 'https://google.com', 'test2.jpg');

REPLACE INTO `antique_name` (`id`, `name`, `site`) VALUES
  (12000, 'Test antique name 12000', 'tiresias'),
  (12001, 'Test antique name 12001', 'tiresias');

REPLACE INTO file (id, card_id, name, filename, mime) VALUES
(13000, 6000, 'Test file 13000', '4k123pkopvs3iDFV948abcde.pdf', 'application/pdf');

REPLACE INTO export (id, site, card_count, file_size) VALUES
(14000, 'dilps', 1, 0),
(14001, 'dilps', 2, 0);

REPLACE INTO export_collection (export_id, collection_id) VALUES
(14001, 2001);

REPLACE INTO export_card (export_id, card_id) VALUES
(14000, 6000),
(14001, 6001),
(14001, 6002);

UPDATE card SET plain_name = name;

COMMIT ;
