<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180919122307 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('UPDATE user SET login = CONCAT("-aai-", login) WHERE type LIKE \'unil\'');
    }
}
