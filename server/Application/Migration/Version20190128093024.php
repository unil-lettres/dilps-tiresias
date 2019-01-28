<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20190128093024 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX idx_161498d35e237e06 ON card');
        $this->addSql('CREATE INDEX card_name_idx ON card (name)');
        $this->addSql('DROP INDEX idx_161498d3e1d6b8e6 ON card');
        $this->addSql('CREATE INDEX card_locality_idx ON card (locality)');
        $this->addSql('DROP INDEX idx_161498d3d7943d68 ON card');
        $this->addSql('CREATE INDEX card_area_idx ON card (area)');
        $this->addSql('DROP INDEX idx_161498d34118d123 ON card');
        $this->addSql('CREATE INDEX card_latitude_idx ON card (latitude)');
        $this->addSql('DROP INDEX idx_161498d385e16f6b ON card');
        $this->addSql('CREATE INDEX card_longitude_idx ON card (longitude)');
        $this->addSql('DROP INDEX idx_3a9f98e5e1d6b8e6 ON institution');
        $this->addSql('CREATE INDEX institution_locality_idx ON institution (locality)');
        $this->addSql('DROP INDEX idx_3a9f98e5d7943d68 ON institution');
        $this->addSql('CREATE INDEX institution_area_idx ON institution (area)');
        $this->addSql('DROP INDEX idx_3a9f98e54118d123 ON institution');
        $this->addSql('CREATE INDEX institution_latitude_idx ON institution (latitude)');
        $this->addSql('DROP INDEX idx_3a9f98e585e16f6b ON institution');
        $this->addSql('CREATE INDEX institution_longitude_idx ON institution (longitude)');
        $this->addSql('DROP INDEX idx_fc4d65325e237e06 ON collection');
        $this->addSql('CREATE INDEX collection_name_idx ON collection (name)');
    }
}
