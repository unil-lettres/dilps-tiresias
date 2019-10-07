<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20191007154049 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE statistic ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE institution ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE collection ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE news ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE card ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE tag ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE user ADD site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(DC2Type:Site)\'');

        $this->addSql('DROP INDEX UNIQ_649B469CAA9E377A ON statistic');
        $this->addSql('CREATE UNIQUE INDEX unique_date ON statistic (date, site)');
        $this->addSql('DROP INDEX unique_name ON institution');
        $this->addSql('CREATE UNIQUE INDEX unique_name ON institution (name, site)');
        $this->addSql('DROP INDEX UNIQ_8D93D649AA08CB10 ON user');
        $this->addSql('CREATE UNIQUE INDEX unique_login ON user (login, site)');
    }
}
