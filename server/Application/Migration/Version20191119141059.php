<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20191119141059 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user CHANGE login login VARCHAR(191) NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE email email VARCHAR(191) DEFAULT NULL;');
        $this->addSql('UPDATE user SET email = NULL WHERE email = ""');
        $this->addSql('CREATE UNIQUE INDEX unique_email ON user (email, site)');
    }
}
