<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201215081613 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE file (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, card_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, filename VARCHAR(190) DEFAULT \'\' NOT NULL, mime VARCHAR(255) DEFAULT \'\' NOT NULL, INDEX IDX_8C9F361061220EA6 (creator_id), INDEX IDX_8C9F36107E3C61F9 (owner_id), INDEX IDX_8C9F3610E37ECFB0 (updater_id), INDEX IDX_8C9F36104ACC9A20 (card_id), UNIQUE INDEX unique_name (filename), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F361061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F36107E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F3610E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F36104ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
    }
}
