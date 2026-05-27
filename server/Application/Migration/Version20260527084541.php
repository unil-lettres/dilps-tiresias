<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260527084541 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE antique_name CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE artist CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE collection CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE country CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE document_type CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE domain CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE file CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE institution CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE log CHANGE request request LONGTEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE material CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE news CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE period CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE tag CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE name name VARCHAR(191) DEFAULT \'\' NOT NULL');
    }
}
