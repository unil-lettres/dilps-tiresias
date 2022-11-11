<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20191007143405 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE card_period (card_id INT NOT NULL, period_id INT NOT NULL, INDEX IDX_B7874DBA4ACC9A20 (card_id), INDEX IDX_B7874DBAEC8B7ADE (period_id), PRIMARY KEY(card_id, period_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE card_period ADD CONSTRAINT FK_B7874DBA4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_period ADD CONSTRAINT FK_B7874DBAEC8B7ADE FOREIGN KEY (period_id) REFERENCES period (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3EC8B7ADE');
        $this->addSql('INSERT INTO card_period (card_id, period_id) SELECT id, period_id FROM card WHERE period_id IS NOT NULL');
        $this->addSql('DROP INDEX IDX_161498D3EC8B7ADE ON card');
        $this->addSql('ALTER TABLE card DROP period_id');
    }
}
