<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20200213004216 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE domain ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE domain SET site = "tiresias"');

        $this->addSql('ALTER TABLE document_type ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE document_type SET site = "tiresias"');

        $this->addSql('ALTER TABLE artist ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE artist SET site = "dilps"');

        $this->addSql('ALTER TABLE material ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE material SET site = "tiresias"');

        $this->addSql('ALTER TABLE antique_name ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE antique_name SET site = "tiresias"');

        $this->addSql('ALTER TABLE period ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE period SET site = "tiresias"');

        $this->addSql('ALTER TABLE `change` ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('UPDATE `change`
    LEFT JOIN card c ON `change`.original_id = c.id
    LEFT JOIN card s ON `change`.suggestion_id = s.id
    SET `change`.site = IFNULL(c.site, s.site)');
    }
}
