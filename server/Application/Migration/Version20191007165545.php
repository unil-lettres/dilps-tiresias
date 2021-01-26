<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20191007165545 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE collection_user (collection_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_C7E4FAA7514956FD (collection_id), INDEX IDX_C7E4FAA7A76ED395 (user_id), PRIMARY KEY(collection_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE collection_user ADD CONSTRAINT FK_C7E4FAA7514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_user ADD CONSTRAINT FK_C7E4FAA7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');

        $this->addSql('UPDATE card SET update_date = NULL WHERE update_date < \'1990-01-01\'');
        $this->addSql('UPDATE card SET creation_date = NULL WHERE creation_date < \'1990-01-01\'');
        $this->addSql('UPDATE user SET update_date = NULL WHERE update_date < \'1990-01-01\'');
        $this->addSql('UPDATE user SET creation_date = NULL WHERE creation_date < \'1990-01-01\'');
    }
}
