<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201211085518 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE log (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', priority SMALLINT NOT NULL, message VARCHAR(5000) NOT NULL, referer VARCHAR(500) NOT NULL, request VARCHAR(1000) NOT NULL, ip VARCHAR(40) NOT NULL, extra LONGTEXT NOT NULL COMMENT \'(DC2Type:json_array)\', url VARCHAR(2000) DEFAULT \'\' NOT NULL, INDEX IDX_8F3F68C561220EA6 (creator_id), INDEX IDX_8F3F68C57E3C61F9 (owner_id), INDEX IDX_8F3F68C5E37ECFB0 (updater_id), INDEX priority (creation_date), INDEX date_created (creation_date), INDEX message (message(191)), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C57E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
    }
}
