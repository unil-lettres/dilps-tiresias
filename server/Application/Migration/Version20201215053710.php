<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201215053710 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE antique_name CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE artist CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE card CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL, CHANGE image_validation_date image_validation_date DATETIME DEFAULT NULL, CHANGE data_validation_date data_validation_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE `change` CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE collection CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE country CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE dating CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE document_type CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE domain CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE institution CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE log CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE material CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE news CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE period CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE statistic CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE tag CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE creation_date creation_date DATETIME DEFAULT NULL, CHANGE update_date update_date DATETIME DEFAULT NULL, CHANGE active_until active_until DATETIME DEFAULT NULL, CHANGE terms_agreement terms_agreement DATETIME DEFAULT NULL');
    }
}
