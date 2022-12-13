<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221213150644 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('UPDATE collection SET parent_id = NULL WHERE parent_id = id');
        $this->addSql('UPDATE domain SET parent_id = NULL WHERE parent_id = id');
        $this->addSql('UPDATE material SET parent_id = NULL WHERE parent_id = id');
        $this->addSql('UPDATE period SET parent_id = NULL WHERE parent_id = id');
        $this->addSql('UPDATE tag SET parent_id = NULL WHERE parent_id = id');
    }
}
