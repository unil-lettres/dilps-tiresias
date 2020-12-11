<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20180302131307 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE card ADD image_validator_id INT DEFAULT NULL, ADD data_validator_id INT DEFAULT NULL, ADD image_validation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD data_validation_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3BAAB3280 FOREIGN KEY (image_validator_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D32692223D FOREIGN KEY (data_validator_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_161498D3BAAB3280 ON card (image_validator_id)');
        $this->addSql('CREATE INDEX IDX_161498D32692223D ON card (data_validator_id)');
    }
}
