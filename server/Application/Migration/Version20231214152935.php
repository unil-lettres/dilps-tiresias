<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20231214152935 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card DROP CONSTRAINT FK_161498D3BAAB3280');
        $this->addSql('ALTER TABLE card DROP CONSTRAINT FK_161498D32692223D');
        $this->addSql('DROP INDEX IDX_161498D3BAAB3280 ON card');
        $this->addSql('DROP INDEX IDX_161498D32692223D ON card');
        $this->addSql('ALTER TABLE card DROP image_validator_id, DROP data_validator_id, DROP image_validation_date, DROP data_validation_date');
    }
}
