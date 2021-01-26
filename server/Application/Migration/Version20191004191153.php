<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20191004191153 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE statistic (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', date VARCHAR(7) NOT NULL, anonymous_page_count INT UNSIGNED DEFAULT 0 NOT NULL, default_page_count INT UNSIGNED DEFAULT 0 NOT NULL, unil_page_count INT UNSIGNED DEFAULT 0 NOT NULL, anonymous_detail_count INT UNSIGNED DEFAULT 0 NOT NULL, default_detail_count INT UNSIGNED DEFAULT 0 NOT NULL, unil_detail_count INT UNSIGNED DEFAULT 0 NOT NULL, anonymous_search_count INT UNSIGNED DEFAULT 0 NOT NULL, default_search_count INT UNSIGNED DEFAULT 0 NOT NULL, unil_search_count INT UNSIGNED DEFAULT 0 NOT NULL, default_login_count INT UNSIGNED DEFAULT 0 NOT NULL, unil_login_count INT UNSIGNED DEFAULT 0 NOT NULL, default_logins LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', unil_logins LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', UNIQUE INDEX UNIQ_649B469CAA9E377A (date), INDEX IDX_649B469C61220EA6 (creator_id), INDEX IDX_649B469C7E3C61F9 (owner_id), INDEX IDX_649B469CE37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE domain (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(191) NOT NULL, INDEX IDX_A7A91E0B61220EA6 (creator_id), INDEX IDX_A7A91E0B7E3C61F9 (owner_id), INDEX IDX_A7A91E0BE37ECFB0 (updater_id), INDEX IDX_A7A91E0B727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE document_type (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(191) NOT NULL, INDEX IDX_2B6ADBBA61220EA6 (creator_id), INDEX IDX_2B6ADBBA7E3C61F9 (owner_id), INDEX IDX_2B6ADBBAE37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE news (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', description LONGTEXT NOT NULL, url VARCHAR(255) DEFAULT \'\' NOT NULL, name VARCHAR(191) NOT NULL, sorting INT DEFAULT 0 NOT NULL, filename VARCHAR(2000) NOT NULL, INDEX IDX_1DD3995061220EA6 (creator_id), INDEX IDX_1DD399507E3C61F9 (owner_id), INDEX IDX_1DD39950E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE material (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(191) NOT NULL, INDEX IDX_7CBE759561220EA6 (creator_id), INDEX IDX_7CBE75957E3C61F9 (owner_id), INDEX IDX_7CBE7595E37ECFB0 (updater_id), INDEX IDX_7CBE7595727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_material (card_id INT NOT NULL, material_id INT NOT NULL, INDEX IDX_C58FBB164ACC9A20 (card_id), INDEX IDX_C58FBB16E308AC6F (material_id), PRIMARY KEY(card_id, material_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE period (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, parent_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', update_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', name VARCHAR(191) NOT NULL, sorting INT DEFAULT 0 NOT NULL, `from` INT DEFAULT NULL, `to` INT DEFAULT NULL, INDEX IDX_C5B81ECE61220EA6 (creator_id), INDEX IDX_C5B81ECE7E3C61F9 (owner_id), INDEX IDX_C5B81ECEE37ECFB0 (updater_id), INDEX IDX_C5B81ECE727ACA70 (parent_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE statistic ADD CONSTRAINT FK_649B469C61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE statistic ADD CONSTRAINT FK_649B469C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE statistic ADD CONSTRAINT FK_649B469CE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0B61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0B7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0BE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0B727ACA70 FOREIGN KEY (parent_id) REFERENCES domain (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE document_type ADD CONSTRAINT FK_2B6ADBBA61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE document_type ADD CONSTRAINT FK_2B6ADBBA7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE document_type ADD CONSTRAINT FK_2B6ADBBAE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD3995061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD399507E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD39950E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE759561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE75957E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE7595E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE7595727ACA70 FOREIGN KEY (parent_id) REFERENCES material (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_material ADD CONSTRAINT FK_C58FBB164ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_material ADD CONSTRAINT FK_C58FBB16E308AC6F FOREIGN KEY (material_id) REFERENCES material (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECE61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECE7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECEE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECE727ACA70 FOREIGN KEY (parent_id) REFERENCES period (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE institution ADD `precision` ENUM(\'locality\', \'site\', \'building\') DEFAULT NULL COMMENT \'(DC2Type:Precision)\'');
        $this->addSql('ALTER TABLE collection ADD copyrights VARCHAR(191) NOT NULL, ADD usage_rights VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE card ADD document_type_id INT DEFAULT NULL, ADD domain_id INT DEFAULT NULL, ADD period_id INT DEFAULT NULL, ADD `precision` ENUM(\'locality\', \'site\', \'building\') DEFAULT NULL COMMENT \'(DC2Type:Precision)\', ADD technique_date VARCHAR(60) DEFAULT \'\' NOT NULL, ADD object_reference LONGTEXT NOT NULL, ADD production_place VARCHAR(60) DEFAULT \'\' NOT NULL, ADD `from` INT DEFAULT NULL, ADD `to` INT DEFAULT NULL, CHANGE literature literature LONGTEXT NOT NULL, CHANGE isbn isbn VARCHAR(30) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D361232A4F FOREIGN KEY (document_type_id) REFERENCES document_type (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3115F0EE5 FOREIGN KEY (domain_id) REFERENCES domain (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3EC8B7ADE FOREIGN KEY (period_id) REFERENCES period (id) ON DELETE SET NULL');
        $this->addSql('CREATE INDEX IDX_161498D361232A4F ON card (document_type_id)');
        $this->addSql('CREATE INDEX IDX_161498D3115F0EE5 ON card (domain_id)');
        $this->addSql('CREATE INDEX IDX_161498D3EC8B7ADE ON card (period_id)');
        $this->addSql('DROP INDEX unique_name ON tag');
        $this->addSql('ALTER TABLE tag ADD parent_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B783727ACA70 FOREIGN KEY (parent_id) REFERENCES tag (id) ON DELETE CASCADE');
        $this->addSql('CREATE INDEX IDX_389B783727ACA70 ON tag (parent_id)');
    }
}
