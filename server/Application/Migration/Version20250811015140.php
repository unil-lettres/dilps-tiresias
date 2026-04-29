<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250811015140 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('SET FOREIGN_KEY_CHECKS=0');

        $this->addSql(
            <<<SQL
                CREATE TABLE `antique_name` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_8655404061220EA6` (`creator_id`),
                  KEY `IDX_865540407E3C61F9` (`owner_id`),
                  KEY `IDX_86554040E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8655404061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_865540407E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_86554040E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `artist` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`name`),
                  KEY `IDX_159968761220EA6` (`creator_id`),
                  KEY `IDX_1599687E37ECFB0` (`updater_id`),
                  KEY `IDX_15996877E3C61F9` (`owner_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_159968761220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_15996877E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_1599687E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `original_id` INT(11) DEFAULT NULL,
                  `institution_id` INT(11) DEFAULT NULL,
                  `country_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `filename` VARCHAR(2000) NOT NULL,
                  `file_size` INT(11) NOT NULL,
                  `width` INT(11) NOT NULL,
                  `height` INT(11) NOT NULL,
                  `dating` VARCHAR(255) NOT NULL DEFAULT '',
                  `name` VARCHAR(191) NOT NULL,
                  `street` VARCHAR(255) NOT NULL DEFAULT '',
                  `postcode` VARCHAR(20) NOT NULL DEFAULT '',
                  `locality` VARCHAR(191) NOT NULL DEFAULT '',
                  `area` VARCHAR(191) NOT NULL DEFAULT '',
                  `addition` LONGTEXT NOT NULL DEFAULT '',
                  `expanded_name` LONGTEXT NOT NULL DEFAULT '',
                  `material` VARCHAR(255) NOT NULL DEFAULT '',
                  `technique_author` VARCHAR(255) NOT NULL DEFAULT '',
                  `format` VARCHAR(255) NOT NULL DEFAULT '',
                  `literature` LONGTEXT NOT NULL DEFAULT '',
                  `page` VARCHAR(10) NOT NULL DEFAULT '',
                  `figure` VARCHAR(10) NOT NULL DEFAULT '',
                  `table` VARCHAR(10) NOT NULL DEFAULT '',
                  `isbn` VARCHAR(30) NOT NULL DEFAULT '',
                  `comment` LONGTEXT NOT NULL DEFAULT '',
                  `rights` VARCHAR(255) NOT NULL DEFAULT '',
                  `museris_url` VARCHAR(255) NOT NULL DEFAULT '',
                  `museris_cote` VARCHAR(255) NOT NULL DEFAULT '',
                  `visibility` ENUM('private','member','public') NOT NULL DEFAULT 'private',
                  `owner_id` INT(11) DEFAULT NULL,
                  `document_type_id` INT(11) DEFAULT NULL,
                  `precision` ENUM('locality','site','building') DEFAULT NULL,
                  `technique_date` VARCHAR(60) NOT NULL DEFAULT '',
                  `object_reference` LONGTEXT NOT NULL DEFAULT '',
                  `production_place` VARCHAR(60) NOT NULL DEFAULT '',
                  `from` INT(11) DEFAULT NULL,
                  `to` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `document_size` VARCHAR(191) NOT NULL DEFAULT '',
                  `url` VARCHAR(2000) NOT NULL DEFAULT '',
                  `url_description` LONGTEXT NOT NULL DEFAULT '',
                  `code` VARCHAR(30) DEFAULT NULL,
                  `location` POINT DEFAULT NULL,
                  `plain_name` VARCHAR(191) NOT NULL DEFAULT '',
                  `legacy_id` INT(11) DEFAULT NULL,
                  `corpus` LONGTEXT NOT NULL DEFAULT '',
                  `cached_artist_names` LONGTEXT NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_code` (`code`,`site`),
                  KEY `IDX_161498D361220EA6` (`creator_id`),
                  KEY `IDX_161498D3E37ECFB0` (`updater_id`),
                  KEY `IDX_161498D3108B7592` (`original_id`),
                  KEY `IDX_161498D310405986` (`institution_id`),
                  KEY `IDX_161498D3F92F3E70` (`country_id`),
                  KEY `IDX_161498D37E3C61F9` (`owner_id`),
                  KEY `card_name_idx` (`name`),
                  KEY `card_locality_idx` (`locality`),
                  KEY `card_area_idx` (`area`),
                  KEY `IDX_161498D361232A4F` (`document_type_id`),
                  KEY `card_plain_name_idx` (`plain_name`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  FULLTEXT KEY `FULLTEXT__CARD_LOCALITY` (`locality`),
                  FULLTEXT KEY `FULLTEXT__CARD_NAMES` (`name`,`expanded_name`),
                  FULLTEXT KEY `FULLTEXT__CARD_CUSTOM_SEARCH` (`dating`,`cached_artist_names`,`addition`,`expanded_name`,`material`,`technique_author`,`object_reference`,`corpus`,`street`,`locality`,`code`,`name`),
                  CONSTRAINT `FK_161498D310405986` FOREIGN KEY (`institution_id`) REFERENCES `institution` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_161498D3108B7592` FOREIGN KEY (`original_id`) REFERENCES `card` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_161498D361220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_161498D361232A4F` FOREIGN KEY (`document_type_id`) REFERENCES `document_type` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_161498D37E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_161498D3E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_161498D3F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_antique_name` (
                  `card_id` INT(11) NOT NULL,
                  `antique_name_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`antique_name_id`),
                  KEY `IDX_9668EE454ACC9A20` (`card_id`),
                  KEY `IDX_9668EE45FDA3A208` (`antique_name_id`),
                  CONSTRAINT `FK_9668EE454ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_9668EE45FDA3A208` FOREIGN KEY (`antique_name_id`) REFERENCES `antique_name` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_artist` (
                  `card_id` INT(11) NOT NULL,
                  `artist_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`artist_id`),
                  KEY `IDX_7366C5F34ACC9A20` (`card_id`),
                  KEY `IDX_7366C5F3B7970CF8` (`artist_id`),
                  CONSTRAINT `FK_7366C5F34ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_7366C5F3B7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_card` (
                  `card_source` INT(11) NOT NULL,
                  `card_target` INT(11) NOT NULL,
                  PRIMARY KEY (`card_source`,`card_target`),
                  KEY `IDX_FA279A712DB52C07` (`card_source`),
                  KEY `IDX_FA279A7134507C88` (`card_target`),
                  CONSTRAINT `FK_FA279A712DB52C07` FOREIGN KEY (`card_source`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_FA279A7134507C88` FOREIGN KEY (`card_target`) REFERENCES `card` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_collection` (
                  `collection_id` INT(11) NOT NULL,
                  `card_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`collection_id`),
                  KEY `IDX_903FF83C4ACC9A20` (`card_id`),
                  KEY `IDX_903FF83C514956FD` (`collection_id`),
                  CONSTRAINT `FK_903FF83C4ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_903FF83C514956FD` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_domain` (
                  `card_id` INT(11) NOT NULL,
                  `domain_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`domain_id`),
                  KEY `IDX_D5964D7F4ACC9A20` (`card_id`),
                  KEY `IDX_D5964D7F115F0EE5` (`domain_id`),
                  CONSTRAINT `FK_D5964D7F115F0EE5` FOREIGN KEY (`domain_id`) REFERENCES `domain` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_D5964D7F4ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_material` (
                  `card_id` INT(11) NOT NULL,
                  `material_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`material_id`),
                  KEY `IDX_C58FBB164ACC9A20` (`card_id`),
                  KEY `IDX_C58FBB16E308AC6F` (`material_id`),
                  CONSTRAINT `FK_C58FBB164ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_C58FBB16E308AC6F` FOREIGN KEY (`material_id`) REFERENCES `material` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_period` (
                  `card_id` INT(11) NOT NULL,
                  `period_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`period_id`),
                  KEY `IDX_B7874DBA4ACC9A20` (`card_id`),
                  KEY `IDX_B7874DBAEC8B7ADE` (`period_id`),
                  CONSTRAINT `FK_B7874DBA4ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_B7874DBAEC8B7ADE` FOREIGN KEY (`period_id`) REFERENCES `period` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `card_tag` (
                  `card_id` INT(11) NOT NULL,
                  `tag_id` INT(11) NOT NULL,
                  PRIMARY KEY (`card_id`,`tag_id`),
                  KEY `IDX_537933424ACC9A20` (`card_id`),
                  KEY `IDX_53793342BAD26311` (`tag_id`),
                  CONSTRAINT `FK_537933424ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_53793342BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `change` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `original_id` INT(11) DEFAULT NULL,
                  `suggestion_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `type` ENUM('create','update','delete') NOT NULL DEFAULT 'update',
                  `request` LONGTEXT NOT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_4057FE20A41BB822` (`suggestion_id`),
                  KEY `IDX_4057FE2061220EA6` (`creator_id`),
                  KEY `IDX_4057FE20E37ECFB0` (`updater_id`),
                  KEY `IDX_4057FE20108B7592` (`original_id`),
                  KEY `IDX_4057FE207E3C61F9` (`owner_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_4057FE20108B7592` FOREIGN KEY (`original_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_4057FE2061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_4057FE207E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_4057FE20A41BB822` FOREIGN KEY (`suggestion_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_4057FE20E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `collection` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `parent_id` INT(11) DEFAULT NULL,
                  `institution_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `description` LONGTEXT NOT NULL,
                  `is_source` TINYINT(1) NOT NULL DEFAULT 0,
                  `sorting` INT(11) NOT NULL DEFAULT 0,
                  `name` VARCHAR(191) NOT NULL,
                  `visibility` ENUM('private','administrator','member') NOT NULL DEFAULT 'private',
                  `owner_id` INT(11) DEFAULT NULL,
                  `copyrights` VARCHAR(191) NOT NULL,
                  `usage_rights` VARCHAR(191) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_FC4D653261220EA6` (`creator_id`),
                  KEY `IDX_FC4D6532E37ECFB0` (`updater_id`),
                  KEY `IDX_FC4D6532727ACA70` (`parent_id`),
                  KEY `IDX_FC4D653210405986` (`institution_id`),
                  KEY `IDX_FC4D65327E3C61F9` (`owner_id`),
                  KEY `collection_name_idx` (`name`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_FC4D653210405986` FOREIGN KEY (`institution_id`) REFERENCES `institution` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_FC4D653261220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_FC4D6532727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_FC4D65327E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_FC4D6532E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `collection_user` (
                  `collection_id` INT(11) NOT NULL,
                  `user_id` INT(11) NOT NULL,
                  PRIMARY KEY (`collection_id`,`user_id`),
                  KEY `IDX_C7E4FAA7514956FD` (`collection_id`),
                  KEY `IDX_C7E4FAA7A76ED395` (`user_id`),
                  CONSTRAINT `FK_C7E4FAA7514956FD` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_C7E4FAA7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `country` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `code` VARCHAR(2) NOT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `UNIQ_5373C96677153098` (`code`),
                  KEY `IDX_5373C96661220EA6` (`creator_id`),
                  KEY `IDX_5373C966E37ECFB0` (`updater_id`),
                  KEY `IDX_5373C9667E3C61F9` (`owner_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  FULLTEXT KEY `FULLTEXT__COUNTRY_NAME` (`name`),
                  CONSTRAINT `FK_5373C96661220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_5373C9667E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_5373C966E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `dating` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `card_id` INT(11) NOT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `from` INT(11) NOT NULL,
                  `to` INT(11) NOT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  KEY `IDX_D06C7A461220EA6` (`creator_id`),
                  KEY `IDX_D06C7A4E37ECFB0` (`updater_id`),
                  KEY `IDX_D06C7A44ACC9A20` (`card_id`),
                  KEY `IDX_D06C7A47E3C61F9` (`owner_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_D06C7A44ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_D06C7A461220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_D06C7A47E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_D06C7A4E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `document_type` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_2B6ADBBA61220EA6` (`creator_id`),
                  KEY `IDX_2B6ADBBA7E3C61F9` (`owner_id`),
                  KEY `IDX_2B6ADBBAE37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_2B6ADBBA61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_2B6ADBBA7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_2B6ADBBAE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `domain` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `parent_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_A7A91E0B61220EA6` (`creator_id`),
                  KEY `IDX_A7A91E0B7E3C61F9` (`owner_id`),
                  KEY `IDX_A7A91E0BE37ECFB0` (`updater_id`),
                  KEY `IDX_A7A91E0B727ACA70` (`parent_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  FULLTEXT KEY `FULLTEXT__DOMAIN_NAME` (`name`),
                  CONSTRAINT `FK_A7A91E0B61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_A7A91E0B727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `domain` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_A7A91E0B7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_A7A91E0BE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `export` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `card_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `filename` VARCHAR(2000) NOT NULL DEFAULT '',
                  `status` ENUM('todo','in_progress','done','errored') NOT NULL DEFAULT 'todo',
                  `format` ENUM('zip','pptx','csv') NOT NULL DEFAULT 'zip',
                  `max_height` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `include_legend` TINYINT(1) NOT NULL DEFAULT 1,
                  `text_color` VARCHAR(255) NOT NULL DEFAULT '#FFFFFF',
                  `background_color` VARCHAR(255) NOT NULL DEFAULT '#000000',
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `file_size` INT(11) NOT NULL,
                  `start` DATETIME DEFAULT NULL,
                  `duration` INT(10) UNSIGNED DEFAULT NULL,
                  `memory` INT(10) UNSIGNED DEFAULT NULL,
                  `error_message` VARCHAR(2000) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  KEY `IDX_428C169461220EA6` (`creator_id`),
                  KEY `IDX_428C16947E3C61F9` (`owner_id`),
                  KEY `IDX_428C1694E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_428C169461220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_428C16947E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_428C1694E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `export_card` (
                  `export_id` INT(11) NOT NULL,
                  `card_id` INT(11) NOT NULL,
                  PRIMARY KEY (`export_id`,`card_id`),
                  KEY `IDX_30A5AE3864CDAF82` (`export_id`),
                  KEY `IDX_30A5AE384ACC9A20` (`card_id`),
                  CONSTRAINT `FK_30A5AE384ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_30A5AE3864CDAF82` FOREIGN KEY (`export_id`) REFERENCES `export` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `export_collection` (
                  `export_id` INT(11) NOT NULL,
                  `collection_id` INT(11) NOT NULL,
                  PRIMARY KEY (`export_id`,`collection_id`),
                  KEY `IDX_37A1D0F864CDAF82` (`export_id`),
                  KEY `IDX_37A1D0F8514956FD` (`collection_id`),
                  CONSTRAINT `FK_37A1D0F8514956FD` FOREIGN KEY (`collection_id`) REFERENCES `collection` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_37A1D0F864CDAF82` FOREIGN KEY (`export_id`) REFERENCES `export` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `file` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `card_id` INT(11) NOT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `filename` VARCHAR(190) NOT NULL DEFAULT '',
                  `mime` VARCHAR(255) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`filename`),
                  KEY `IDX_8C9F361061220EA6` (`creator_id`),
                  KEY `IDX_8C9F36107E3C61F9` (`owner_id`),
                  KEY `IDX_8C9F3610E37ECFB0` (`updater_id`),
                  KEY `IDX_8C9F36104ACC9A20` (`card_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8C9F36104ACC9A20` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_8C9F361061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8C9F36107E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8C9F3610E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `institution` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `country_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `street` VARCHAR(255) NOT NULL DEFAULT '',
                  `postcode` VARCHAR(20) NOT NULL DEFAULT '',
                  `locality` VARCHAR(191) NOT NULL DEFAULT '',
                  `area` VARCHAR(191) NOT NULL DEFAULT '',
                  `owner_id` INT(11) DEFAULT NULL,
                  `precision` ENUM('locality','site','building') DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `location` POINT DEFAULT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_name` (`name`,`site`),
                  KEY `IDX_3A9F98E561220EA6` (`creator_id`),
                  KEY `IDX_3A9F98E5E37ECFB0` (`updater_id`),
                  KEY `IDX_3A9F98E5F92F3E70` (`country_id`),
                  KEY `IDX_3A9F98E57E3C61F9` (`owner_id`),
                  KEY `institution_locality_idx` (`locality`),
                  KEY `institution_area_idx` (`area`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  FULLTEXT KEY `FULLTEXT__INSTITUTION_NAME` (`name`),
                  FULLTEXT KEY `FULLTEXT__INSTITUTION_LOCALITY` (`locality`),
                  CONSTRAINT `FK_3A9F98E561220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_3A9F98E57E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_3A9F98E5E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_3A9F98E5F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country` (`id`) ON DELETE SET NULL
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `log` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `level` SMALLINT(6) NOT NULL,
                  `message` VARCHAR(5000) NOT NULL,
                  `referer` VARCHAR(500) NOT NULL DEFAULT '',
                  `request` VARCHAR(1000) NOT NULL DEFAULT '',
                  `ip` VARCHAR(40) NOT NULL DEFAULT '',
                  `context` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`context`)),
                  `url` VARCHAR(2000) NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  KEY `IDX_8F3F68C561220EA6` (`creator_id`),
                  KEY `IDX_8F3F68C57E3C61F9` (`owner_id`),
                  KEY `IDX_8F3F68C5E37ECFB0` (`updater_id`),
                  KEY `message` (`message`(191)),
                  KEY `update_date` (`update_date`),
                  KEY `creation_date` (`creation_date`),
                  KEY `level` (`level`),
                  CONSTRAINT `FK_8F3F68C561220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8F3F68C57E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8F3F68C5E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `material` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `parent_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_7CBE759561220EA6` (`creator_id`),
                  KEY `IDX_7CBE75957E3C61F9` (`owner_id`),
                  KEY `IDX_7CBE7595E37ECFB0` (`updater_id`),
                  KEY `IDX_7CBE7595727ACA70` (`parent_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_7CBE759561220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_7CBE7595727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `material` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_7CBE75957E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_7CBE7595E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `message` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `recipient_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `email` VARCHAR(191) NOT NULL,
                  `type` ENUM('export_done') NOT NULL,
                  `date_sent` DATETIME DEFAULT NULL,
                  `subject` VARCHAR(255) NOT NULL DEFAULT '',
                  `body` TEXT NOT NULL DEFAULT '',
                  PRIMARY KEY (`id`),
                  KEY `IDX_B6BD307F61220EA6` (`creator_id`),
                  KEY `IDX_B6BD307F7E3C61F9` (`owner_id`),
                  KEY `IDX_B6BD307FE37ECFB0` (`updater_id`),
                  KEY `IDX_B6BD307FE92F8F78` (`recipient_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_B6BD307F61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_B6BD307F7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_B6BD307FE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_B6BD307FE92F8F78` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `news` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `description` LONGTEXT NOT NULL,
                  `url` VARCHAR(2000) NOT NULL DEFAULT '',
                  `name` VARCHAR(191) NOT NULL,
                  `sorting` INT(11) NOT NULL DEFAULT 0,
                  `filename` VARCHAR(2000) NOT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_1DD3995061220EA6` (`creator_id`),
                  KEY `IDX_1DD399507E3C61F9` (`owner_id`),
                  KEY `IDX_1DD39950E37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_1DD3995061220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_1DD399507E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_1DD39950E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `period` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `parent_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `sorting` INT(11) NOT NULL DEFAULT 0,
                  `from` INT(11) DEFAULT NULL,
                  `to` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_C5B81ECE61220EA6` (`creator_id`),
                  KEY `IDX_C5B81ECE7E3C61F9` (`owner_id`),
                  KEY `IDX_C5B81ECEE37ECFB0` (`updater_id`),
                  KEY `IDX_C5B81ECE727ACA70` (`parent_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_C5B81ECE61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_C5B81ECE727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `period` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_C5B81ECE7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_C5B81ECEE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `statistic` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `date` VARCHAR(7) NOT NULL,
                  `anonymous_page_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `default_page_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `aai_page_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `anonymous_detail_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `default_detail_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `aai_detail_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `anonymous_search_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `default_search_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `aai_search_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `default_login_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `aai_login_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  `default_logins` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`default_logins`)),
                  `aai_logins` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`aai_logins`)),
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_date` (`date`,`site`),
                  KEY `IDX_649B469C61220EA6` (`creator_id`),
                  KEY `IDX_649B469C7E3C61F9` (`owner_id`),
                  KEY `IDX_649B469CE37ECFB0` (`updater_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_649B469C61220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_649B469C7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_649B469CE37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `tag` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  `owner_id` INT(11) DEFAULT NULL,
                  `parent_id` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `usage_count` INT(10) UNSIGNED NOT NULL DEFAULT 0,
                  PRIMARY KEY (`id`),
                  KEY `IDX_389B78361220EA6` (`creator_id`),
                  KEY `IDX_389B783E37ECFB0` (`updater_id`),
                  KEY `IDX_389B7837E3C61F9` (`owner_id`),
                  KEY `IDX_389B783727ACA70` (`parent_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_389B78361220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_389B783727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE,
                  CONSTRAINT `FK_389B7837E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_389B783E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql(
            <<<SQL
                CREATE TABLE `user` (
                  `id` INT(11) NOT NULL AUTO_INCREMENT,
                  `creator_id` INT(11) DEFAULT NULL,
                  `updater_id` INT(11) DEFAULT NULL,
                  `institution_id` INT(11) DEFAULT NULL,
                  `creation_date` DATETIME DEFAULT NULL,
                  `update_date` DATETIME DEFAULT NULL,
                  `login` VARCHAR(191) NOT NULL,
                  `password` VARCHAR(255) NOT NULL,
                  `email` VARCHAR(191) DEFAULT NULL,
                  `active_until` DATETIME DEFAULT NULL,
                  `terms_agreement` DATETIME DEFAULT NULL,
                  `type` ENUM('default','aai','legacy') NOT NULL DEFAULT 'default',
                  `role` ENUM('student','junior','senior','major','administrator') NOT NULL DEFAULT 'student',
                  `owner_id` INT(11) DEFAULT NULL,
                  `site` ENUM('dilps','tiresias') NOT NULL,
                  `name` VARCHAR(191) NOT NULL,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `unique_login` (`login`,`site`),
                  UNIQUE KEY `unique_email` (`email`,`site`),
                  KEY `IDX_8D93D64961220EA6` (`creator_id`),
                  KEY `IDX_8D93D649E37ECFB0` (`updater_id`),
                  KEY `IDX_8D93D64910405986` (`institution_id`),
                  KEY `IDX_8D93D6497E3C61F9` (`owner_id`),
                  KEY `creation_date` (`creation_date`),
                  KEY `update_date` (`update_date`),
                  CONSTRAINT `FK_8D93D64910405986` FOREIGN KEY (`institution_id`) REFERENCES `institution` (`id`) ON DELETE SET NULL,
                  CONSTRAINT `FK_8D93D64961220EA6` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8D93D6497E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
                  CONSTRAINT `FK_8D93D649E37ECFB0` FOREIGN KEY (`updater_id`) REFERENCES `user` (`id`)
                ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                SQL
        );

        $this->addSql('SET FOREIGN_KEY_CHECKS=1');

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
