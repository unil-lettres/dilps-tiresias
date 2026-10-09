<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20260724080514 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE collection_subscriber (collection_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_E9A73AD514956FD (collection_id), INDEX IDX_E9A73ADA76ED395 (user_id), PRIMARY KEY (collection_id, user_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE collection_subscriber ADD CONSTRAINT FK_E9A73AD514956FD FOREIGN KEY (collection_id) REFERENCES collection (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE collection_subscriber ADD CONSTRAINT FK_E9A73ADA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }
}
