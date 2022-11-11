<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180227152608 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user ADD role ENUM(\'student\', \'junior\', \'senior\', \'administrator\') DEFAULT \'student\' NOT NULL COMMENT \'(DC2Type:UserRole)\'');
        $this->addSql('UPDATE user SET role = \'administrator\' WHERE is_administrator = 1');
        $this->addSql('ALTER TABLE user DROP is_administrator');
    }
}
