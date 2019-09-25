INSERT INTO `user` (`id`, `login`, `email`, password, role) VALUES
  (1000, 'administrator', 'administrator@example.com', MD5('administrator'), 'administrator'),
  (1001, 'senior', 'senior@example.com', MD5('senior'), 'senior'),
  (1002, 'junior', 'junior@example.com', MD5('junior'), 'junior'),
  (1003, 'student', 'student@example.com', MD5('student'), 'student');

INSERT INTO `collection` (`id`, owner_id, visibility, `name`, `description`) VALUES
  (2000, 1003, 'private', 'Test collection 2000', 'Roads? Where we''re going we don''t need roads.'),
  (2001, NULL, 'member', 'Test collection 2001', 'Hello. My name is Inigo Montoya. You killed my father. Prepare to die.'),
  (2002, 1002, 'member', 'Test collection 2002', 'You''re gonna need a bigger boat.');

INSERT INTO `artist` (`id`, `name`) VALUES
  (3000, 'Test artist 3000');

INSERT INTO `tag` (`id`, `name`) VALUES
  (4000, 'Test tag 4000');

INSERT INTO `institution` (`id`, `country_id`, `name`, `street`, `postcode`, `locality`, `area`) VALUES
  (5000, 1, 'Test institution 5000', '5th Avenue 1000', '10028', 'New York', 'USA | north america');

INSERT INTO `card` (`id`, owner_id, creator_id, `original_id`, visibility, `name`, `filename`, `width`, `height`, file_size, dating) VALUES
  (6000, 1003, 1003, NULL, 'private', 'Test card 6000', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '2000'),
  (6001, 1003, 1003, NULL, 'private', 'Test suggestion card 6001', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, ''),
  (6002, 1003, 1003, 6000, 'private', 'Test suggestion card 6002', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, ''),
  (6003, 1003, 1003, NULL, 'private', 'Test card 6003', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, ''),
  (6004, 1003, 1003, 6000, 'member', 'Test card 6004', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, ''),
  (6005, NULL, NULL, 6000, 'public', 'Test related card 6005', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, ''),
  (6006, 1002, 1002, NULL, 'member', 'Test junior card 6006', 'dw4jV3zYSPsqE2CB8BcP8ABD0.jpg', 960, 425, 90188, '');

INSERT INTO `card_artist` (`card_id`, `artist_id`) VALUES
  (6000, 3000);

INSERT INTO `card_tag` (`card_id`, `tag_id`) VALUES
  (6000, 4000);

INSERT INTO `collection_card` (`collection_id`, `card_id`) VALUES
  (2000, 6000),
  (2001, 6001),
  (2001, 6002);

INSERT INTO `change` (`id`, `original_id`, `suggestion_id`, `type`, `request`) VALUES
  (7000, NULL, 6001, 'create', 'I want to add new card to collection'),
  (7001, 6000, 6002, 'update', 'I want to edit existing card'),
  (7002, 6000, NULL, 'delete', 'I want to delete existing card');

INSERT INTO `dating` (`id`, `card_id`, `from`, `to`) VALUES
  (8000, 6000, '2451545', '2451545');

INSERT INTO `card_card` (`card_source`, `card_target`) VALUES
  (6000, 6005),
  (6005, 6000);
