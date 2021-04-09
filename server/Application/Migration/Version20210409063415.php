<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20210409063415 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE export ADD error_message VARCHAR(2000) DEFAULT \'\' NOT NULL, CHANGE status status ENUM(\'todo\', \'in_progress\', \'done\', \'errored\') DEFAULT \'todo\' NOT NULL COMMENT \'(DC2Type:ExportStatus)\'');
    }
}
