<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180228095414 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE collection ADD visibility ENUM(\'private\', \'member\', \'public\') DEFAULT \'private\' NOT NULL COMMENT \'(DC2Type:Visibility)\'');
        $this->addSql('ALTER TABLE card ADD visibility ENUM(\'private\', \'member\', \'public\') DEFAULT \'private\' NOT NULL COMMENT \'(DC2Type:Visibility)\'');
        $this->addSql('UPDATE card SET visibility = \'public\' WHERE is_public = 1');
        $this->addSql('ALTER TABLE card DROP is_public');
    }
}
