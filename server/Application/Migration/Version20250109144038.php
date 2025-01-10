<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250109144038 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Remove dilps_domain from the fulltext index.
        $this->addSql(<<<'SQL'
                DROP INDEX FULLTEXT__CARD_CUSTOM_SEARCH ON card;
                CREATE FULLTEXT INDEX FULLTEXT__CARD_CUSTOM_SEARCH ON card (
                    dating,
                    cached_artist_names,
                    addition,
                    expanded_name,
                    material,
                    technique_author,
                    object_reference,
                    corpus,
                    street,
                    locality,
                    code,
                    name
                );
            SQL);
    }

    public function down(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                DROP INDEX FULLTEXT__CARD_CUSTOM_SEARCH ON card;
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
            SQL);
    }
}
