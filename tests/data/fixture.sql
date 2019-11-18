START TRANSACTION;

REPLACE INTO `user` (`id`, `login`, `email`, password, role, site) VALUES
  (1000, 'administrator', 'administrator-dilps@example.com', MD5('administrator'), 'administrator', 'dilps'),
  (1001, 'senior', 'senior-dilps@example.com', MD5('senior'), 'senior', 'dilps'),
  (1002, 'junior', 'junior-dilps@example.com', MD5('junior'), 'junior', 'dilps'),
  (1003, 'student', 'student-dilps@example.com', MD5('student'), 'student', 'dilps'),
  (1004, 'administrator', 'administrator-tiresias@example.com', MD5('administrator'), 'administrator', 'tiresias'),
  (1005, 'senior', 'senior-tiresias@example.com', MD5('senior'), 'senior', 'tiresias'),
  (1006, 'junior', 'junior-tiresias@example.com', MD5('junior'), 'junior', 'tiresias'),
  (1007, 'student', 'student-tiresias@example.com', MD5('student'), 'student', 'tiresias');

REPLACE INTO `collection` (`id`, owner_id, visibility, `name`, `description`, `site`) VALUES
  (2000, 1003, 'private', 'Test collection 2000', 'Roads? Where we''re going we don''t need roads.', 'dilps'),
  (2001, NULL, 'member', 'Test collection 2001', 'Hello. My name is Inigo Montoya. You killed my father. Prepare to die.', 'dilps'),
  (2002, 1002, 'member', 'Test collection 2002', 'You''re gonna need a bigger boat.', 'dilps'),
  (2003, 1007, 'private', 'Test collection 2003', 'Roads? Where we''re going we don''t need roads.', 'tiresias'),
  (2004, NULL, 'member', 'Test collection 2004', 'Hello. My name is Inigo Montoya. You killed my father. Prepare to die.', 'tiresias'),
  (2005, 1006, 'member', 'Test collection 2005', 'You''re gonna need a bigger boat.', 'tiresias');

REPLACE INTO `artist` (`id`, `name`) VALUES
  (3000, 'Test artist 3000');

REPLACE INTO `tag` (`id`, `parent_id`, `name`, `site`) VALUES
  (4000, NULL, 'Test root tag 4000', 'dilps'),
  (4001, 4000, 'Test child tag 40001', 'dilps'),
  (4002, NULL, 'Test root tag 4002', 'tiresias'),
  (4003, 4002, 'Test child tag 4003', 'tiresias');

REPLACE INTO `institution` (`id`, `country_id`, `name`, `site`) VALUES
  (5000, 1, 'Test institution 5000', 'dilps'),
  (5001, 1, 'Test institution 5001', 'tiresias');

REPLACE INTO `card` (`id`, owner_id, creator_id, `original_id`, visibility, site, `name`, `filename`, `width`, `height`, `file_size`, `dating`, `latitude`, `longitude`, `precision`) VALUES
  (6000, 1003, 1003, NULL, 'private', 'dilps', 'Test card 6000', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '2000', '46.9937969', '6.9301', NULL),
  (6001, 1003, 1003, NULL, 'private', 'dilps', 'Test suggestion card 6001', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '46.5210895', '6.5779666', NULL),
  (6002, 1003, 1003, 6000, 'private', 'dilps', 'Test suggestion card 6002', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '46.5214586', '6.5814212', NULL),
  (6003, 1003, 1003, NULL, 'private', 'dilps', 'Test card 6003', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '46.5219361', '6.5832964', NULL),
  (6004, 1003, 1003, 6000, 'member', 'dilps', 'Test card 6004', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '41.1621376', '-8.6570586,13', NULL),
  (6005, NULL, NULL, 6000, 'public', 'dilps', 'Test related card 6005', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '-33.8567844', '151.2131027', NULL),
  (6006, 1002, 1002, NULL, 'member', 'dilps', 'Test junior card 6006', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '', '40.7828647', '-73.9675491', NULL),
  (6007, 1007, 1007, NULL, 'private', 'tiresias', 'Test card 6007', '5da49355cbcff.jpeg', 1950, 1300, 90188, '2000', '41.8906832', '12.4917557', 'site'),
  (6008, 1007, 1007, NULL, 'private', 'tiresias', 'Test suggestion card 6008', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8906842', '12.4917557', 'site'),
  (6009, 1007, 1007, 6007, 'private', 'tiresias', 'Test suggestion card 6009', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8906832', '12.4917567', 'site'),
  (6010, 1007, 1007, NULL, 'private', 'tiresias', 'Test card 6010', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8906822', '12.4917557', 'site'),
  (6011, 1007, 1007, 6007, 'member', 'tiresias', 'Test card 6011', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8906832', '12.4917547', 'site'),
  (6012, NULL, NULL, 6007, 'public', 'tiresias', 'Test related card 6012', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8916832', '12.4917557', 'site'),
  (6013, 1006, 1006, NULL, 'member', 'tiresias', 'Test junior card 6013', '5da49355cbcff.jpeg', 1950, 1300, 90188, '', '41.8906832', '12.4927557', 'site');

REPLACE INTO `card_artist` (`card_id`, `artist_id`) VALUES
  (6000, 3000);

REPLACE INTO `card_tag` (`card_id`, `tag_id`) VALUES
  (6000, 4000);

REPLACE INTO `collection_card` (`collection_id`, `card_id`) VALUES
  (2000, 6000),
  (2001, 6001),
  (2001, 6002);

REPLACE INTO `change` (`id`, `original_id`, `suggestion_id`, `type`, `request`) VALUES
  (7000, NULL, 6001, 'create', 'I want to add new card to collection'),
  (7001, 6000, 6002, 'update', 'I want to edit existing card'),
  (7002, 6000, NULL, 'delete', 'I want to delete existing card');

REPLACE INTO `dating` (`id`, `card_id`, `from`, `to`) VALUES
  (8000, 6000, '2451545', '2451545');

REPLACE INTO `card_card` (`card_source`, `card_target`) VALUES
  (6000, 6005),
  (6005, 6000);

REPLACE INTO `period` (`id`, `parent_id`, `name`) VALUES
  (7000, NULL, 'Test root period 7000'),
  (7001, 7000, 'Test child period 7001');

REPLACE INTO `material` (`id`, `parent_id`, `name`) VALUES
  (8000, NULL, 'Test root material 8000'),
  (8001, 8000, 'Test child material 8001');

REPLACE INTO `domain` (`id`, `name`) VALUES
  (9000, 'Test domain 9000'),
  (9001, 'Test domain 9001');

REPLACE INTO `document_type` (`id`, `name`) VALUES
  (9000, 'Test domain 9000'),
  (9001, 'Test domain 9001');

REPLACE INTO `news` (`id`, `site`, `name`, `description`, url, filename) VALUES
  (10000, 'tiresias', 'Test news 10000', 'Donec ullamcorper nulla non metus auctor fringilla. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'https://example.com', 'test1.jpg'),
  (10001, 'tiresias', 'Test news 10001', 'Curabitur blandit tempus porttitor. Donec sed odio dui.', 'https://google.com', 'test2.jpg');

REPLACE INTO `antique_name` (`id`, `name`) VALUES
  (11000, 'Test antique name 11000'),
  (11001, 'Test antique name 11001');

COMMIT ;
