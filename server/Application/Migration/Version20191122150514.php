<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20191122150514 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card ADD url VARCHAR(255) DEFAULT \'\' NOT NULL, ADD url_description LONGTEXT DEFAULT \'\' NOT NULL');
    }
}
