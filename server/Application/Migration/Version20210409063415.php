<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20210409063415 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE export ADD error_message VARCHAR(2000) DEFAULT \'\' NOT NULL, CHANGE status status ENUM(\'todo\', \'in_progress\', \'done\', \'errored\') DEFAULT \'todo\' NOT NULL COMMENT \'(DC2Type:ExportStatus)\'');
    }
}
