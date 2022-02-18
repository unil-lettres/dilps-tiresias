<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20200416083238 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE card ADD plain_name VARCHAR(191) NOT NULL');
        $this->addSql("UPDATE card SET plain_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, '<strong>', ''), '</strong>', ''), '<em>', ''), '</em>', ''), '<u>', ''), '</u>', '')");
        $this->addSql('CREATE INDEX card_plain_name_idx ON card (plain_name);');
    }
}
