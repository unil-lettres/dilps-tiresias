<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20190114101422 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX IDX_161498D3E1D6B8E6 ON card;');
        $this->addSql('DROP INDEX IDX_161498D3D7943D68 ON card;');
        $this->addSql('CREATE INDEX IDX_161498D3E1D6B8E6 ON card (locality);');
        $this->addSql('CREATE INDEX IDX_161498D3D7943D68 ON card (area);');
        $this->addSql('DROP INDEX IDX_3A9F98E5D7943D68 ON institution;');
        $this->addSql('DROP INDEX IDX_3A9F98E5E1D6B8E6 ON institution;');
        $this->addSql('CREATE INDEX IDX_3A9F98E5D7943D68 ON institution (area);');
        $this->addSql('CREATE INDEX IDX_3A9F98E5E1D6B8E6 ON institution (locality);');
    }
}
