<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221010191052 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX creation_date ON antique_name (creation_date)');
        $this->addSql('CREATE INDEX update_date ON antique_name (update_date)');
        $this->addSql('CREATE INDEX creation_date ON artist (creation_date)');
        $this->addSql('CREATE INDEX update_date ON artist (update_date)');
        $this->addSql('CREATE INDEX creation_date ON card (creation_date)');
        $this->addSql('CREATE INDEX update_date ON card (update_date)');
        $this->addSql('CREATE INDEX creation_date ON `change` (creation_date)');
        $this->addSql('CREATE INDEX update_date ON `change` (update_date)');
        $this->addSql('CREATE INDEX creation_date ON collection (creation_date)');
        $this->addSql('CREATE INDEX update_date ON collection (update_date)');
        $this->addSql('CREATE INDEX creation_date ON country (creation_date)');
        $this->addSql('CREATE INDEX update_date ON country (update_date)');
        $this->addSql('CREATE INDEX creation_date ON dating (creation_date)');
        $this->addSql('CREATE INDEX update_date ON dating (update_date)');
        $this->addSql('CREATE INDEX creation_date ON document_type (creation_date)');
        $this->addSql('CREATE INDEX update_date ON document_type (update_date)');
        $this->addSql('CREATE INDEX creation_date ON domain (creation_date)');
        $this->addSql('CREATE INDEX update_date ON domain (update_date)');
        $this->addSql('CREATE INDEX creation_date ON export (creation_date)');
        $this->addSql('CREATE INDEX update_date ON export (update_date)');
        $this->addSql('CREATE INDEX creation_date ON file (creation_date)');
        $this->addSql('CREATE INDEX update_date ON file (update_date)');
        $this->addSql('CREATE INDEX creation_date ON institution (creation_date)');
        $this->addSql('CREATE INDEX update_date ON institution (update_date)');
        $this->addSql('DROP INDEX priority ON log');
        $this->addSql('CREATE INDEX update_date ON log (update_date)');
        $this->addSql('CREATE INDEX priority ON log (priority)');
        $this->addSql('DROP INDEX date_created ON log');
        $this->addSql('CREATE INDEX creation_date ON log (creation_date)');
        $this->addSql('CREATE INDEX creation_date ON material (creation_date)');
        $this->addSql('CREATE INDEX update_date ON material (update_date)');
        $this->addSql('CREATE INDEX creation_date ON message (creation_date)');
        $this->addSql('CREATE INDEX update_date ON message (update_date)');
        $this->addSql('CREATE INDEX creation_date ON news (creation_date)');
        $this->addSql('CREATE INDEX update_date ON news (update_date)');
        $this->addSql('CREATE INDEX creation_date ON period (creation_date)');
        $this->addSql('CREATE INDEX update_date ON period (update_date)');
        $this->addSql('CREATE INDEX creation_date ON statistic (creation_date)');
        $this->addSql('CREATE INDEX update_date ON statistic (update_date)');
        $this->addSql('CREATE INDEX creation_date ON tag (creation_date)');
        $this->addSql('CREATE INDEX update_date ON tag (update_date)');
        $this->addSql('CREATE INDEX creation_date ON user (creation_date)');
        $this->addSql('CREATE INDEX update_date ON user (update_date)');
    }
}
