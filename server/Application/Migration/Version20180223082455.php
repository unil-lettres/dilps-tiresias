<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20180223082455 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE institution (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, country_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, latitude DOUBLE PRECISION DEFAULT NULL, longitude DOUBLE PRECISION DEFAULT NULL, street VARCHAR(255) NOT NULL, postcode VARCHAR(20) NOT NULL, locality VARCHAR(255) NOT NULL, area VARCHAR(255) NOT NULL, INDEX IDX_3A9F98E561220EA6 (creator_id), INDEX IDX_3A9F98E5E37ECFB0 (updater_id), INDEX IDX_3A9F98E5F92F3E70 (country_id), INDEX IDX_3A9F98E55E237E06 (name), INDEX IDX_3A9F98E5E1D6B8E6 (locality), INDEX IDX_3A9F98E5D7943D68 (area), INDEX IDX_3A9F98E54118D123 (latitude), INDEX IDX_3A9F98E585E16F6B (longitude), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collection (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, institution_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', description LONGTEXT NOT NULL, is_source TINYINT(1) DEFAULT \'0\' NOT NULL, sorting INT DEFAULT 0 NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_FC4D653261220EA6 (creator_id), INDEX IDX_FC4D6532E37ECFB0 (updater_id), INDEX IDX_FC4D6532727ACA70 (parent_id), INDEX IDX_FC4D653210405986 (institution_id), INDEX IDX_FC4D65325E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collection_card (collection_id INT NOT NULL, card_id INT NOT NULL, INDEX IDX_5C63B43D514956FD (collection_id), INDEX IDX_5C63B43D4ACC9A20 (card_id), PRIMARY KEY(collection_id, card_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dating (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, card_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', `from` INT NOT NULL, `to` INT NOT NULL, INDEX IDX_D06C7A461220EA6 (creator_id), INDEX IDX_D06C7A4E37ECFB0 (updater_id), INDEX IDX_D06C7A44ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE country (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', code VARCHAR(2) NOT NULL, name VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_5373C96677153098 (code), INDEX IDX_5373C96661220EA6 (creator_id), INDEX IDX_5373C966E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE artist (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, INDEX IDX_159968761220EA6 (creator_id), INDEX IDX_1599687E37ECFB0 (updater_id), INDEX IDX_15996875E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, original_id INT DEFAULT NULL, institution_id INT DEFAULT NULL, country_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', filename VARCHAR(2000) NOT NULL, file_size INT NOT NULL, width INT NOT NULL, height INT NOT NULL, is_public TINYINT(1) DEFAULT \'0\' NOT NULL, dating VARCHAR(255) DEFAULT \'\' NOT NULL, status ENUM(\'new\', \'edited\', \'reviewed\') DEFAULT \'new\' NOT NULL COMMENT \'(DC2Type:CardStatus)\', name VARCHAR(255) NOT NULL, latitude DOUBLE PRECISION DEFAULT NULL, longitude DOUBLE PRECISION DEFAULT NULL, street VARCHAR(255) NOT NULL, postcode VARCHAR(20) NOT NULL, locality VARCHAR(255) NOT NULL, area VARCHAR(255) NOT NULL, addition VARCHAR(255) DEFAULT \'\' NOT NULL, expanded_name VARCHAR(255) DEFAULT \'\' NOT NULL, material VARCHAR(255) DEFAULT \'\' NOT NULL, technique VARCHAR(255) DEFAULT \'\' NOT NULL, technique_author VARCHAR(255) DEFAULT \'\' NOT NULL, format VARCHAR(255) DEFAULT \'\' NOT NULL, literature VARCHAR(255) DEFAULT \'\' NOT NULL, page VARCHAR(10) DEFAULT \'\' NOT NULL, figure VARCHAR(10) DEFAULT \'\' NOT NULL, `table` VARCHAR(10) DEFAULT \'\' NOT NULL, isbn VARCHAR(20) DEFAULT \'\' NOT NULL, comment LONGTEXT NOT NULL, rights VARCHAR(255) DEFAULT \'\' NOT NULL, museris_url VARCHAR(255) DEFAULT \'\' NOT NULL, museris_cote VARCHAR(255) DEFAULT \'\' NOT NULL, INDEX IDX_161498D361220EA6 (creator_id), INDEX IDX_161498D3E37ECFB0 (updater_id), INDEX IDX_161498D3108B7592 (original_id), INDEX IDX_161498D310405986 (institution_id), INDEX IDX_161498D3F92F3E70 (country_id), INDEX IDX_161498D35E237E06 (name), INDEX IDX_161498D3E1D6B8E6 (locality), INDEX IDX_161498D3D7943D68 (area), INDEX IDX_161498D34118D123 (latitude), INDEX IDX_161498D385E16F6B (longitude), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_artist (card_id INT NOT NULL, artist_id INT NOT NULL, INDEX IDX_7366C5F34ACC9A20 (card_id), INDEX IDX_7366C5F3B7970CF8 (artist_id), PRIMARY KEY(card_id, artist_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_tag (card_id INT NOT NULL, tag_id INT NOT NULL, INDEX IDX_537933424ACC9A20 (card_id), INDEX IDX_53793342BAD26311 (tag_id), PRIMARY KEY(card_id, tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_card (card_source INT NOT NULL, card_target INT NOT NULL, INDEX IDX_FA279A712DB52C07 (card_source), INDEX IDX_FA279A7134507C88 (card_target), PRIMARY KEY(card_source, card_target)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(255) NOT NULL, INDEX IDX_389B78361220EA6 (creator_id), INDEX IDX_389B783E37ECFB0 (updater_id), INDEX IDX_389B7835E237E06 (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, institution_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', login VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(191) NOT NULL, is_administrator TINYINT(1) NOT NULL, active_until DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', terms_agreement DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type ENUM(\'default\', \'unil\') DEFAULT \'default\' NOT NULL COMMENT \'(DC2Type:UserType)\', UNIQUE INDEX UNIQ_8D93D649AA08CB10 (login), INDEX IDX_8D93D64961220EA6 (creator_id), INDEX IDX_8D93D649E37ECFB0 (updater_id), INDEX IDX_8D93D64910405986 (institution_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `change` (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, original_id INT DEFAULT NULL, suggestion_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', type ENUM(\'create\', \'update\', \'delete\') DEFAULT \'update\' NOT NULL COMMENT \'(DC2Type:ChangeType)\', request LONGTEXT NOT NULL, INDEX IDX_4057FE2061220EA6 (creator_id), INDEX IDX_4057FE20E37ECFB0 (updater_id), INDEX IDX_4057FE20108B7592 (original_id), INDEX IDX_4057FE20A41BB822 (suggestion_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E5F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D653261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D6532E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D6532727ACA70 FOREIGN KEY (parent_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D653210405986 FOREIGN KEY (institution_id) REFERENCES institution (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE collection_card ADD CONSTRAINT FK_5C63B43D514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_card ADD CONSTRAINT FK_5C63B43D4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A4E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A44ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C96661220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C966E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_159968761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_1599687E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3108B7592 FOREIGN KEY (original_id) REFERENCES card (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D310405986 FOREIGN KEY (institution_id) REFERENCES institution (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card_artist ADD CONSTRAINT FK_7366C5F34ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_artist ADD CONSTRAINT FK_7366C5F3B7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_tag ADD CONSTRAINT FK_537933424ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_tag ADD CONSTRAINT FK_53793342BAD26311 FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_card ADD CONSTRAINT FK_FA279A712DB52C07 FOREIGN KEY (card_source) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_card ADD CONSTRAINT FK_FA279A7134507C88 FOREIGN KEY (card_target) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B78361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B783E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64910405986 FOREIGN KEY (institution_id) REFERENCES institution (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE2061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20108B7592 FOREIGN KEY (original_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20A41BB822 FOREIGN KEY (suggestion_id) REFERENCES card (id) ON DELETE SET NULL');

        $this->addSql('INSERT INTO country (id, code, name) VALUES
(1, "CH", "Suisse"),
(2, "FR", "France"),
(3, "AU", "Australie"),
(4, "AT", "Autriche"),
(5, "BE", "Belgique"),
(6, "CA", "Canada"),
(7, "CZ", "République tchèque"),
(8, "DK", "Danemark"),
(9, "FI", "Finlande"),
(10, "DE", "Allemagne"),
(11, "GR", "Grèce"),
(12, "HU", "Hongrie"),
(13, "IS", "Islande"),
(14, "IE", "Irlande"),
(15, "IT", "Italie"),
(16, "JP", "Japon"),
(17, "LU", "Luxembourg"),
(18, "MX", "Mexique"),
(19, "NL", "Pays-Bas"),
(20, "NZ", "Nouvelle-Zélande"),
(21, "NO", "Norvège"),
(22, "PL", "Pologne"),
(23, "PT", "Portugal"),
(24, "SK", "Slovaquie"),
(25, "KR", "Corée du Sud"),
(26, "ES", "Espagne"),
(27, "SE", "Suède"),
(28, "TR", "Turquie"),
(29, "GB", "Angleterre"),
(30, "US", "États-Unis"),
(31, "AX", "Îles Åland"),
(32, "AF", "Afghanistan"),
(33, "AL", "Albanie"),
(34, "DZ", "Algérie"),
(35, "AS", "Samoa américaines"),
(36, "AD", "Andorre"),
(37, "AO", "Angola"),
(38, "AI", "Anguilla"),
(39, "AQ", "Antarctique"),
(40, "AG", "Antigua et Barbuda"),
(41, "AR", "Argentine"),
(42, "AM", "Arménie"),
(43, "AW", "Aruba"),
(44, "AZ", "Azerbaïdjan"),
(45, "BS", "Bahamas"),
(46, "BH", "Bahreïn"),
(47, "BD", "Bangladesh"),
(48, "BB", "Barbade"),
(49, "BY", "Biélorussie"),
(50, "BZ", "Belize"),
(51, "BJ", "Bénin"),
(52, "BM", "Bermudes"),
(53, "BT", "Bhutan"),
(54, "BO", "Bolivie"),
(55, "BQ", "Bonaire, Saint-Eustache et Saba"),
(56, "BA", "Bosnie-Herzégovine"),
(57, "BW", "Botswana"),
(58, "BV", "Île Bouvet"),
(59, "BR", "Brésil"),
(60, "IO", "Territoire britannique de l\'océan Indien"),
(61, "VG", "Îles Vierges"),
(62, "BN", "Brunéi Darussalam"),
(63, "BG", "Bulgarie"),
(64, "BF", "Burkina Faso"),
(65, "BI", "Burundi"),
(66, "KH", "Cambodge"),
(67, "CM", "Cameroun"),
(68, "CV", "Cap-Vert"),
(69, "KY", "Îles Caïmans"),
(70, "CF", "Centrafrique"),
(71, "TD", "Tchad"),
(72, "CL", "Chili"),
(73, "CN", "Chine"),
(74, "CX", "Île Christmas"),
(75, "CC", "Îles Cocos"),
(76, "CO", "Colombie"),
(77, "KM", "Comores"),
(78, "CK", "Îles Cook"),
(79, "CR", "Costa Rica"),
(80, "HR", "Croatie"),
(81, "CU", "Cuba"),
(82, "CW", "Curaçao"),
(83, "CY", "Chypre"),
(84, "CD", "République démocratique du Congo"),
(85, "DJ", "Djibouti"),
(86, "DM", "Dominique"),
(87, "DO", "République Dominicaine"),
(88, "TL", "Timor Oriental"),
(89, "EC", "Équateur"),
(90, "EG", "Égypte"),
(91, "SV", "Salvador"),
(92, "GQ", "Guinée équatoriale"),
(93, "ER", "Érythrée"),
(94, "EE", "Estonie"),
(95, "ET", "Éthiopie"),
(96, "FK", "Îles Malouines"),
(97, "FO", "Îles Féroé"),
(98, "FJ", "Fidji"),
(99, "GF", "Guyane"),
(100, "PF", "Polynésie Française"),
(101, "TF", "Terres australes françaises"),
(102, "GA", "Gabon"),
(103, "GM", "Gambie"),
(104, "GE", "Géorgie"),
(105, "GH", "Ghana"),
(106, "GI", "Gibraltar"),
(107, "GL", "Groenland"),
(108, "GD", "Grenade"),
(109, "GP", "Guadeloupe"),
(110, "GU", "Guam"),
(111, "GT", "Guatemala"),
(112, "GG", "Guernesey"),
(113, "GN", "Guinée"),
(114, "GW", "Guinée-Bissau"),
(115, "GY", "Guyana"),
(116, "HT", "Haïti"),
(117, "HM", "Île Heard et îles McDonald"),
(118, "HN", "Honduras"),
(119, "HK", "Hong Kong"),
(120, "IN", "Inde"),
(121, "ID", "Indonésie"),
(122, "IR", "Iran"),
(123, "IQ", "Irak"),
(124, "IM", "Île de Man"),
(125, "IL", "Israël"),
(126, "CI", "Côte d\'Ivoire"),
(127, "JM", "Jamaïque"),
(128, "JE", "Jersey"),
(129, "JO", "Jordanie"),
(130, "KZ", "Kazakhstan"),
(131, "KE", "Kenya"),
(132, "KI", "Kiribati"),
(133, "XK", "Kosovo"),
(134, "KW", "Koweït"),
(135, "KG", "Kirghizistan"),
(136, "LA", "Laos"),
(137, "LV", "Lettonie"),
(138, "LB", "Liban"),
(139, "LS", "Lesotho"),
(140, "LR", "Liberia"),
(141, "LY", "Libye"),
(142, "LI", "Liechtenstein"),
(143, "LT", "Lituanie"),
(144, "MO", "Macao"),
(145, "MK", "Macédoine"),
(146, "MG", "Madagascar"),
(147, "MW", "Malawi"),
(148, "MY", "Malaisie"),
(149, "MV", "Maldives"),
(150, "ML", "Mali"),
(151, "MT", "Malte"),
(152, "MH", "Îles Marshall"),
(153, "MQ", "Martinique"),
(154, "MR", "Mauritanie"),
(155, "MU", "Maurice"),
(156, "YT", "Mayotte"),
(157, "FM", "Micronésie"),
(158, "MD", "Moldavie"),
(159, "MC", "Monaco"),
(160, "MN", "Mongolie"),
(161, "ME", "Monténégro"),
(162, "MS", "Montserrat"),
(163, "MA", "Maroc"),
(164, "MZ", "Mozambique"),
(165, "MM", "Myanmar"),
(166, "NA", "Namibie"),
(167, "NR", "Nauru"),
(168, "NP", "Népal"),
(169, "AN", "Antilles néerlandaises"),
(170, "NC", "Nouvelle-Calédonie"),
(171, "NI", "Nicaragua"),
(172, "NE", "Niger"),
(173, "NG", "Nigeria"),
(174, "NU", "Nioué"),
(175, "NF", "Île Norfolk"),
(176, "KP", "Corée du Nord"),
(177, "MP", "Îles Mariannes du Nord"),
(178, "OM", "Oman"),
(179, "PK", "Pakistan"),
(180, "PW", "Palaos"),
(181, "PS", "Territoire palestinien"),
(182, "PA", "Panama"),
(183, "PG", "Papouasie-Nouvelle Guinée"),
(184, "PY", "Paraguay"),
(185, "PE", "Pérou"),
(186, "PH", "Philippines"),
(187, "PN", "Pitcairn"),
(188, "PR", "Porto Rico"),
(189, "QA", "Qatar"),
(190, "RE", "Réunion"),
(191, "CG", "Congo-Brazzaville"),
(192, "RO", "Roumanie"),
(193, "RU", "Russie"),
(194, "RW", "Rwanda"),
(195, "ST", "São Tomé-et-Príncipe"),
(196, "BL", "Saint-Barthélémy"),
(197, "SH", "Sainte-Hélène"),
(198, "KN", "Saint-Christophe-et-Niévès"),
(199, "LC", "Sainte-Lucie"),
(200, "MF", "Saint-Martin"), 
(201, "PM", "Saint-Pierre et Miquelon"),
(202, "VC", "Saint-Vincent-et-les Grenadines"),
(203, "WS", "Samoa"),
(204, "SM", "Saint-Marin"),
(205, "SA", "Arabie saoudite"),
(206, "SN", "Sénégal"),
(207, "RS", "Serbie"),
(208, "SC", "Seychelles"),
(209, "SL", "Sierra Leone"),
(210, "SG", "Singapour"),
(211, "SX", "Saint-Martin"),
(212, "SI", "Slovénie"),
(213, "SB", "Îles Salomon"),
(214, "SO", "Somalie"),
(215, "ZA", "Afrique du Sud"),
(216, "GS", "Géorgie du Sud et les îles Sandwich du Sud"),
(217, "SS", "Sud-Soudan"),
(218, "LK", "Sri Lanka"),
(219, "SD", "Soudan"),
(220, "SR", "Surinam"),
(221, "SJ", "Svalbard et Île Jan Mayen"),
(222, "SZ", "Swaziland"),
(223, "SY", "Syrie"),
(224, "TW", "Taïwan"),
(225, "TJ", "Tadjikistan"),
(226, "TZ", "Tanzanie"),
(227, "TH", "Thaïlande"),
(228, "TG", "République Togolaise"),
(229, "TK", "Tokelau"),
(230, "TO", "Tonga"),
(231, "TT", "Trinidad et Tobago"),
(232, "TN", "Tunisie"),
(233, "TM", "Turkménistan"),
(234, "TC", "Îles Turques-et-Caïques"),
(235, "TV", "Tuvalu"),
(236, "UM", "Îles mineures éloignées des États-Unis"),
(237, "VI", "Îles Vierges des États-Unis"),
(238, "UG", "Ouganda"),
(239, "UA", "Ukraine"),
(240, "AE", "Émirats Arabes Unis"),
(241, "UY", "Uruguay"),
(242, "UZ", "Ouzbékistan"),
(243, "VU", "Vanuatu"),
(244, "VA", "Vatican"),
(245, "VE", "Vénézuéla"),
(246, "VN", "Vietnam"),
(247, "WF", "Wallis-et-Futuna"),
(248, "EH", "Sahara Occidental"),
(249, "YE", "Yémen"),
(250, "ZM", "Zambie"),
(251, "ZW", "Zimbabwe")
');
    }
}
