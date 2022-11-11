<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201217074413 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE export (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, card_count INT UNSIGNED DEFAULT 0 NOT NULL, filename VARCHAR(2000) DEFAULT \'\' NOT NULL, status ENUM(\'todo\', \'in_progress\', \'done\') DEFAULT \'todo\' NOT NULL COMMENT \'(DC2Type:ExportStatus)\', format ENUM(\'zip\', \'pptx\', \'csv\') DEFAULT \'zip\' NOT NULL COMMENT \'(DC2Type:ExportFormat)\', max_height INT UNSIGNED DEFAULT 0 NOT NULL, include_legend TINYINT(1) DEFAULT \'1\' NOT NULL, text_color VARCHAR(255) DEFAULT \'#FFFFFF\' NOT NULL, background_color VARCHAR(255) DEFAULT \'#000000\' NOT NULL, site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\', file_size INT NOT NULL, INDEX IDX_428C169461220EA6 (creator_id), INDEX IDX_428C16947E3C61F9 (owner_id), INDEX IDX_428C1694E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE export_collection (export_id INT NOT NULL, collection_id INT NOT NULL, INDEX IDX_37A1D0F864CDAF82 (export_id), INDEX IDX_37A1D0F8514956FD (collection_id), PRIMARY KEY(export_id, collection_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE export_card (export_id INT NOT NULL, card_id INT NOT NULL, INDEX IDX_30A5AE3864CDAF82 (export_id), INDEX IDX_30A5AE384ACC9A20 (card_id), PRIMARY KEY(export_id, card_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE export ADD CONSTRAINT FK_428C169461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE export ADD CONSTRAINT FK_428C16947E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE export ADD CONSTRAINT FK_428C1694E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE export_collection ADD CONSTRAINT FK_37A1D0F864CDAF82 FOREIGN KEY (export_id) REFERENCES export (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE export_collection ADD CONSTRAINT FK_37A1D0F8514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE export_card ADD CONSTRAINT FK_30A5AE3864CDAF82 FOREIGN KEY (export_id) REFERENCES export (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE export_card ADD CONSTRAINT FK_30A5AE384ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
    }
}
