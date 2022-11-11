<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180820065444 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user CHANGE type type ENUM(\'default\', \'unil\', \'legacy\') DEFAULT \'default\' NOT NULL COMMENT \'(DC2Type:UserType)\'');
    }
}
