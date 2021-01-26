<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20180816061141 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE institution CHANGE name name VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE collection CHANGE name name VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE country CHANGE name name VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE artist CHANGE name name VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE card CHANGE name name VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE tag CHANGE name name VARCHAR(191) NOT NULL');

        // Migrate duplicated artist to always use the same one
        $this->addSql('
UPDATE IGNORE card_artist
JOIN artist ON card_artist.artist_id = artist.id
JOIN (SELECT MIN(id) AS id, name FROM artist GROUP BY name HAVING COUNT(*) > 1) AS dup ON artist.name = dup.name
SET artist_id = dup.id;');

        // Delete duplicated artists that are not the one we kept
        $this->addSql('
DELETE artist
FROM artist
JOIN (SELECT MIN(id) AS id, name FROM artist GROUP BY name HAVING COUNT(*) > 1) AS dup
ON artist.name = dup.name
AND artist.id != dup.id;');

        // Make institution name as unique as possible
        $this->addSql("UPDATE institution SET name = CONCAT(name, IF(locality != '', CONCAT(' - ', locality), ''));");

        // Migrate duplicated institution to always use the same one
        $this->addSql('
UPDATE IGNORE card
JOIN institution ON card.institution_id = institution.id
JOIN (SELECT MIN(id) AS id, name FROM institution GROUP BY name HAVING COUNT(*) > 1) AS dup ON institution.name = dup.name
SET institution_id = dup.id;');

        $this->addSql('
UPDATE IGNORE user
JOIN institution ON user.institution_id = institution.id
JOIN (SELECT MIN(id) AS id, name FROM institution GROUP BY name HAVING COUNT(*) > 1) AS dup ON institution.name = dup.name
SET institution_id = dup.id;');

        $this->addSql('
UPDATE IGNORE collection
JOIN institution ON collection.institution_id = institution.id
JOIN (SELECT MIN(id) AS id, name FROM institution GROUP BY name HAVING COUNT(*) > 1) AS dup ON institution.name = dup.name
SET institution_id = dup.id;');

        // Delete duplicated institutions that are not the one we kept
        $this->addSql('
DELETE institution
FROM institution
JOIN (SELECT MIN(id) AS id, name FROM institution GROUP BY name HAVING COUNT(*) > 1) AS dup
ON institution.name = dup.name
AND institution.id != dup.id;');

        $this->addSql('ALTER TABLE institution DROP INDEX IDX_3A9F98E55E237E06, ADD UNIQUE INDEX unique_name (name)');
        $this->addSql('ALTER TABLE artist DROP INDEX IDX_15996875E237E06, ADD UNIQUE INDEX unique_name (name)');
        $this->addSql('ALTER TABLE tag DROP INDEX IDX_389B7835E237E06, ADD UNIQUE INDEX unique_name (name)');
    }
}
