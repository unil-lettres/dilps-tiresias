<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250423020623 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                ALTER TABLE antique_name CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE artist CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE card CHANGE visibility visibility ENUM('private', 'member', 'public') DEFAULT 'private' NOT NULL, CHANGE `precision` `precision` ENUM('locality', 'site', 'building') DEFAULT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL, CHANGE location location POINT DEFAULT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE `change` CHANGE type type ENUM('create', 'update', 'delete') DEFAULT 'update' NOT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE collection CHANGE visibility visibility ENUM('private', 'administrator', 'member') DEFAULT 'private' NOT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE document_type CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE domain CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE export CHANGE status status ENUM('todo', 'in_progress', 'done', 'errored') DEFAULT 'todo' NOT NULL, CHANGE format format ENUM('zip', 'pptx', 'csv') DEFAULT 'zip' NOT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE institution CHANGE `precision` `precision` ENUM('locality', 'site', 'building') DEFAULT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL, CHANGE location location POINT DEFAULT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE log CHANGE extra extra JSON DEFAULT '{}' NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE material CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE message CHANGE type type ENUM('export_done') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE news CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE period CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE statistic CHANGE default_logins default_logins JSON NOT NULL, CHANGE aai_logins aai_logins JSON NOT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE tag CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE user CHANGE type type ENUM('default', 'aai', 'legacy') DEFAULT 'default' NOT NULL, CHANGE role role ENUM('student', 'junior', 'senior', 'major', 'administrator') DEFAULT 'student' NOT NULL, CHANGE site site ENUM('dilps', 'tiresias') NOT NULL
            SQL);
    }
}
