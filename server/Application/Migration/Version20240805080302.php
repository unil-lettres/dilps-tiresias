<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20240805080302 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                CREATE FULLTEXT INDEX FULLTEXT__CARD_CUSTOM_SEARCH ON card (
                    dating,
                    cached_artist_names,
                    addition,
                    expanded_name,
                    material,
                    dilps_domain,
                    technique_author,
                    object_reference,
                    corpus,
                    street,
                    locality,
                    code,
                    name
                );

                CREATE FULLTEXT INDEX FULLTEXT__CARD_LOCALITY ON card (
                    locality
                );

                CREATE FULLTEXT INDEX FULLTEXT__CARD_NAMES ON card (
                    name, expanded_name
                );

                CREATE FULLTEXT INDEX FULLTEXT__COUNTRY_NAME ON country (
                    name
                );

                CREATE FULLTEXT INDEX FULLTEXT__DOMAIN_NAME ON domain (
                    name
                );

                CREATE FULLTEXT INDEX FULLTEXT__INSTITUTION_NAME ON institution (
                    name
                );

                CREATE FULLTEXT INDEX FULLTEXT__INSTITUTION_LOCALITY ON institution (
                    locality
                );

            SQL);
    }

    public function down(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                DROP INDEX FULLTEXT__CARD_CUSTOM_SEARCH ON card;

                DROP INDEX FULLTEXT__CARD_LOCALITY ON card;

                DROP INDEX FULLTEXT__CARD_NAMES ON card;

                DROP INDEX FULLTEXT__COUNTRY_NAME ON country;

                DROP INDEX FULLTEXT__DOMAIN_NAME ON domain;

                DROP INDEX FULLTEXT__INSTITUTION_NAME ON institution;

                DROP INDEX FULLTEXT__INSTITUTION_LOCALITY ON institution;
            SQL);
    }
}
