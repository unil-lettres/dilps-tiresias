<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221121153413 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card ADD cached_artist_names LONGTEXT DEFAULT \'\' NOT NULL');
        $this->addSql(
            <<<STRING
                    UPDATE card LEFT JOIN (
                        SELECT card_artist.card_id, IFNULL(GROUP_CONCAT(artist.name ORDER BY artist.id SEPARATOR '\n'), '') AS artists FROM card_artist
                        INNER JOIN artist ON card_artist.artist_id = artist.id
                        GROUP BY card_artist.card_id
                    ) AS tmp ON card.id = tmp.card_id
                    SET cached_artist_names = IFNULL(tmp.artists, '')
                STRING
        );
    }
}
