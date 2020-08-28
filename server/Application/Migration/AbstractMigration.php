<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

/**
 * Abstract migration to always forbid down migrations because we don't want
 * to create more work maintenance than necessary
 */
abstract class AbstractMigration extends \Doctrine\Migrations\AbstractMigration
{
    final public function down(Schema $schema): void
    {
        $this->throwIrreversibleMigrationException();
    }
}
