<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20180314060107 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE `change` DROP INDEX IDX_4057FE20A41BB822, ADD UNIQUE INDEX UNIQ_4057FE20A41BB822 (suggestion_id)');
    }
}
