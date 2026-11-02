<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20261102100000 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // An export bigger than 2 GiB could not be saved, because its size overflowed the column
        $this->addSql('ALTER TABLE card CHANGE file_size file_size BIGINT NOT NULL');
        $this->addSql('ALTER TABLE export CHANGE file_size file_size BIGINT NOT NULL');
    }
}
