<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20191118144606 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE card_antique_name (card_id INT NOT NULL, antique_name_id INT NOT NULL, INDEX IDX_9668EE454ACC9A20 (card_id), INDEX IDX_9668EE45FDA3A208 (antique_name_id), PRIMARY KEY(card_id, antique_name_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE antique_name (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(191) NOT NULL, INDEX IDX_8655404061220EA6 (creator_id), INDEX IDX_865540407E3C61F9 (owner_id), INDEX IDX_86554040E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card_antique_name ADD CONSTRAINT FK_9668EE454ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_antique_name ADD CONSTRAINT FK_9668EE45FDA3A208 FOREIGN KEY (antique_name_id) REFERENCES antique_name (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE antique_name ADD CONSTRAINT FK_8655404061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE antique_name ADD CONSTRAINT FK_865540407E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE antique_name ADD CONSTRAINT FK_86554040E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
    }
}
