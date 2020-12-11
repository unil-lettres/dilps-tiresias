<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20200208064342 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP INDEX institution_longitude_idx ON institution');
        $this->addSql('DROP INDEX institution_latitude_idx ON institution');
        $this->addSql('ALTER TABLE institution ADD location POINT DEFAULT NULL COMMENT \'(DC2Type:point)\'');
        $this->addSql('UPDATE institution SET longitude = NULL, latitude = NULL WHERE longitude = 0 OR latitude = 0');
        $this->addSql('UPDATE institution SET location = ST_PointFromText(CONCAT(\'POINT(\', longitude ,\' \', latitude,\')\')) WHERE longitude IS NOT NULL AND latitude IS NOT NULL');
        $this->addSql('ALTER TABLE institution DROP latitude, DROP longitude');

        $this->addSql('DROP INDEX card_latitude_idx ON card');
        $this->addSql('DROP INDEX card_longitude_idx ON card');
        $this->addSql('ALTER TABLE card ADD location POINT DEFAULT NULL COMMENT \'(DC2Type:point)\'');
        $this->addSql('UPDATE card SET longitude = NULL, latitude = NULL WHERE longitude = 0 OR latitude = 0');
        $this->addSql('UPDATE card SET location = ST_PointFromText(CONCAT(\'POINT(\', longitude ,\' \', latitude,\')\')) WHERE longitude IS NOT NULL AND latitude IS NOT NULL');
        $this->addSql('ALTER TABLE card DROP latitude, DROP longitude');
    }
}
