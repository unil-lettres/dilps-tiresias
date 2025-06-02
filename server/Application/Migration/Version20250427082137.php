<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20250427082137 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql(<<<'SQL'
                DROP INDEX priority ON log
            SQL);
        $this->addSql(<<<'SQL'
                ALTER TABLE log CHANGE priority level SMALLINT NOT NULL, CHANGE extra context JSON DEFAULT '{}' NOT NULL
            SQL);
        $this->addSql(
            <<<SQL
                    UPDATE log SET level = CASE level WHEN 0 THEN 600 WHEN 1 THEN 550 WHEN 2 THEN 500 WHEN 3 THEN 400 WHEN 4 THEN 300 WHEN 5 THEN 250 WHEN 6 THEN 200 WHEN 7 THEN 100 ELSE level END
                SQL
        );
        $this->addSql(<<<'SQL'
                CREATE INDEX level ON log (level)
            SQL);
    }
}
