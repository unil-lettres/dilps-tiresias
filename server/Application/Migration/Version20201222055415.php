<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201222055415 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE export ADD start DATETIME DEFAULT NULL, ADD duration INT UNSIGNED DEFAULT NULL, ADD memory INT UNSIGNED DEFAULT NULL');
    }
}
