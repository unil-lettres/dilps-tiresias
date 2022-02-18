<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20201222055415 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE export ADD start DATETIME DEFAULT NULL, ADD duration INT UNSIGNED DEFAULT NULL, ADD memory INT UNSIGNED DEFAULT NULL');
    }
}
