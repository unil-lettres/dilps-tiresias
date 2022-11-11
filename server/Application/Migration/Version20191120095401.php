<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20191120095401 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE statistic CHANGE unil_page_count aai_page_count INT UNSIGNED DEFAULT 0 NOT NULL, CHANGE unil_detail_count aai_detail_count INT UNSIGNED DEFAULT 0 NOT NULL, CHANGE unil_search_count aai_search_count INT UNSIGNED DEFAULT 0 NOT NULL, CHANGE unil_login_count aai_login_count INT UNSIGNED DEFAULT 0 NOT NULL, CHANGE unil_logins aai_logins LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\'');

        $this->addSql('ALTER TABLE user CHANGE type type TEXT;');
        $this->addSql('UPDATE user SET type = \'aai\' WHERE type = \'unil\';');
        $this->addSql('ALTER TABLE user CHANGE type type ENUM(\'default\', \'aai\', \'legacy\') DEFAULT \'default\' NOT NULL COMMENT \'(DC2Type:UserType)\'; ');
    }
}
