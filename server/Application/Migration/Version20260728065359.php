<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260728065359 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Rename the collection_user join table to collection_responsible, so its purpose (the users responsible
        // for a collection) is obvious when reading the database. Data is preserved.
        $this->addSql('ALTER TABLE collection_user DROP FOREIGN KEY `FK_C7E4FAA7514956FD`');
        $this->addSql('ALTER TABLE collection_user DROP FOREIGN KEY `FK_C7E4FAA7A76ED395`');
        $this->addSql('ALTER TABLE collection_user RENAME TO collection_responsible');
        $this->addSql('ALTER TABLE collection_responsible RENAME INDEX IDX_C7E4FAA7514956FD TO IDX_B4CB969514956FD');
        $this->addSql('ALTER TABLE collection_responsible RENAME INDEX IDX_C7E4FAA7A76ED395 TO IDX_B4CB969A76ED395');
        $this->addSql('ALTER TABLE collection_responsible ADD CONSTRAINT FK_B4CB969514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_responsible ADD CONSTRAINT FK_B4CB969A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }
}
