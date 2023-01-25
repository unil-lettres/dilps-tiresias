<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20230125152547 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card CHANGE url url VARCHAR(2000) DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE news CHANGE url url VARCHAR(2000) DEFAULT \'\' NOT NULL');
    }
}
