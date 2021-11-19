<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20211119015647 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE dating CHANGE card_id card_id INT NOT NULL');
    }
}
