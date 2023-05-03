<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20230426081006 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE antique_name ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE artist ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE document_type ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE domain ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE institution ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE material ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE period ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE tag ADD usage_count INT UNSIGNED DEFAULT 0 NOT NULL');

        $this->addSql(
            <<<SQL
                UPDATE antique_name INNER JOIN (
                    SELECT card_antique_name.antique_name_id AS id, COUNT(*) AS count
                    FROM card_antique_name
                    GROUP BY id
                ) AS tmp ON tmp.id = antique_name.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE artist INNER JOIN (
                    SELECT card_artist.artist_id AS id, COUNT(*) AS count
                    FROM card_artist
                    GROUP BY id
                ) AS tmp ON tmp.id = artist.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE document_type INNER JOIN (
                    SELECT card.document_type_id AS id, COUNT(*) AS count
                    FROM card
                    GROUP BY document_type_id
                ) AS tmp ON tmp.id = document_type.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE domain INNER JOIN (
                    SELECT card_domain.domain_id AS id, COUNT(*) AS count
                    FROM card_domain
                    GROUP BY id
                ) AS tmp ON tmp.id = domain.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE institution INNER JOIN (
                    SELECT card.institution_id AS id, COUNT(*) AS count
                    FROM card
                    GROUP BY institution_id
                ) AS tmp ON tmp.id = institution.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE material INNER JOIN (
                    SELECT card_material.material_id AS id, COUNT(*) AS count
                    FROM card_material
                    GROUP BY id
                ) AS tmp ON tmp.id = material.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE period INNER JOIN (
                    SELECT card_period.period_id AS id, COUNT(*) AS count
                    FROM card_period
                    GROUP BY id
                ) AS tmp ON tmp.id = period.id
                SET usage_count = tmp.count;
                SQL
        );

        $this->addSql(
            <<<SQL
                UPDATE tag INNER JOIN (
                    SELECT card_tag.tag_id AS id, COUNT(*) AS count
                    FROM card_tag
                    GROUP BY id
                ) AS tmp ON tmp.id = tag.id
                SET usage_count = tmp.count;
                SQL
        );
    }
}
