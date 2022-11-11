<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221111144651 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card CHANGE addition addition LONGTEXT DEFAULT \'\' NOT NULL, CHANGE literature literature LONGTEXT DEFAULT \'\' NOT NULL, CHANGE object_reference object_reference LONGTEXT DEFAULT \'\' NOT NULL');
        $this->addSql('ALTER TABLE message CHANGE body body TEXT DEFAULT \'\' NOT NULL');
    }
}
