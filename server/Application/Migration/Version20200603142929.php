<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20200603142929 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user CHANGE role role ENUM(\'student\', \'junior\', \'senior\', \'major\', \'administrator\') DEFAULT \'student\' NOT NULL COMMENT \'(DC2Type:UserRole)\'');
    }
}
