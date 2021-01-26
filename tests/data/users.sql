START TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;

REPLACE INTO `user` (`id`, `login`, `email`, password, role, site) VALUES
  (1000, 'administrator', 'administrator-dilps@example.com', MD5('administrator'), 'administrator', 'dilps'),
  (1001, 'senior', 'senior-dilps@example.com', MD5('senior'), 'senior', 'dilps'),
  (1002, 'junior', 'junior-dilps@example.com', MD5('junior'), 'junior', 'dilps'),
  (1003, 'student', 'student-dilps@example.com', MD5('student'), 'student', 'dilps'),
  (1004, 'administrator', 'administrator-tiresias@example.com', MD5('administrator'), 'administrator', 'tiresias'),
  (1005, 'senior', 'senior-tiresias@example.com', MD5('senior'), 'senior', 'tiresias'),
  (1006, 'junior', 'junior-tiresias@example.com', MD5('junior'), 'junior', 'tiresias'),
  (1007, 'student', 'student-tiresias@example.com', MD5('student'), 'student', 'tiresias'),
  (1008, 'major', 'major-tiresias@example.com', MD5('major'), 'major', 'tiresias'),
  (1009, 'major', 'major-dilps@example.com', MD5('major'), 'major', 'dilps');

SET FOREIGN_KEY_CHECKS = 1;

UPDATE export SET creator_id = 1000 WHERE id IN (14000, 14001);

COMMIT ;
