<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20240711122040 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card CHANGE street street VARCHAR(255) DEFAULT \'\' NOT NULL, CHANGE postcode postcode VARCHAR(20) DEFAULT \'\' NOT NULL, CHANGE locality locality VARCHAR(191) DEFAULT \'\' NOT NULL, CHANGE area area VARCHAR(191) DEFAULT \'\' NOT NULL, CHANGE comment comment LONGTEXT DEFAULT \'\' NOT NULL, CHANGE document_size document_size VARCHAR(191) DEFAULT \'\' NOT NULL, CHANGE plain_name plain_name VARCHAR(191) DEFAULT \'\' NOT NULL, CHANGE corpus corpus LONGTEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE institution CHANGE street street VARCHAR(255) DEFAULT \'\' NOT NULL, CHANGE postcode postcode VARCHAR(20) DEFAULT \'\' NOT NULL, CHANGE locality locality VARCHAR(191) DEFAULT \'\' NOT NULL, CHANGE area area VARCHAR(191) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE log CHANGE referer referer VARCHAR(500) DEFAULT \'\' NOT NULL, CHANGE request request VARCHAR(1000) DEFAULT \'\' NOT NULL, CHANGE ip ip VARCHAR(40) DEFAULT \'\' NOT NULL');
    }
}
