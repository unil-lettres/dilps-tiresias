<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180314060107 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE `change` DROP INDEX IDX_4057FE20A41BB822, ADD UNIQUE INDEX UNIQ_4057FE20A41BB822 (suggestion_id)');
    }
}
