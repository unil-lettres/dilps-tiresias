<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20200819005818 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('RENAME TABLE collection_card TO card_collection');
        $this->addSql('ALTER TABLE card_collection DROP PRIMARY KEY, ADD PRIMARY KEY (card_id, collection_id), DROP CONSTRAINT FK_5C63B43D4ACC9A20, DROP CONSTRAINT FK_5C63B43D514956FD, DROP INDEX IDX_5C63B43D4ACC9A20, DROP INDEX IDX_5C63B43D514956FD, ADD INDEX IDX_903FF83C4ACC9A20 (card_id), ADD INDEX IDX_903FF83C514956FD (collection_id)');
        $this->addSql('ALTER TABLE card_collection ADD CONSTRAINT FK_903FF83C4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE card_collection ADD CONSTRAINT FK_903FF83C514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
    }
}
