<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20201214093416 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE card_domain (card_id INT NOT NULL, domain_id INT NOT NULL, INDEX IDX_D5964D7F4ACC9A20 (card_id), INDEX IDX_D5964D7F115F0EE5 (domain_id), PRIMARY KEY(card_id, domain_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card_domain ADD CONSTRAINT FK_D5964D7F4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_domain ADD CONSTRAINT FK_D5964D7F115F0EE5 FOREIGN KEY (domain_id) REFERENCES domain (id) ON DELETE CASCADE');
        $this->addSql('INSERT INTO card_domain (card_id, domain_id) SELECT id, domain_id FROM card WHERE domain_id IS NOT NULL');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3115F0EE5');
        $this->addSql('DROP INDEX IDX_161498D3115F0EE5 ON card');
        $this->addSql('ALTER TABLE card DROP domain_id');
    }
}
