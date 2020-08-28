<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200331060430 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('UPDATE period SET sorting = 0 WHERE parent_id IS NULL');
    }
}
