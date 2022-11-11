<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20200204053143 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card ADD code VARCHAR(30) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX unique_code ON card (code, site)');
    }
}
