<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20180328033450 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE institution ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E57E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_3A9F98E57E3C61F9 ON institution (owner_id)');
        $this->addSql('ALTER TABLE collection ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D65327E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_FC4D65327E3C61F9 ON collection (owner_id)');
        $this->addSql('ALTER TABLE dating ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A47E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_D06C7A47E3C61F9 ON dating (owner_id)');
        $this->addSql('ALTER TABLE country ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C9667E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_5373C9667E3C61F9 ON country (owner_id)');
        $this->addSql('ALTER TABLE artist ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_15996877E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_15996877E3C61F9 ON artist (owner_id)');
        $this->addSql('ALTER TABLE card ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D37E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_161498D37E3C61F9 ON card (owner_id)');
        $this->addSql('ALTER TABLE tag ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B7837E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_389B7837E3C61F9 ON tag (owner_id)');
        $this->addSql('ALTER TABLE user ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6497E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_8D93D6497E3C61F9 ON user (owner_id)');
        $this->addSql('ALTER TABLE `change` ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE207E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_4057FE207E3C61F9 ON `change` (owner_id)');

        $this->addSql('UPDATE institution SET owner_id = creator_id');
        $this->addSql('UPDATE collection SET owner_id = creator_id');
        $this->addSql('UPDATE dating SET owner_id = creator_id');
        $this->addSql('UPDATE country SET owner_id = creator_id');
        $this->addSql('UPDATE artist SET owner_id = creator_id');
        $this->addSql('UPDATE card SET owner_id = creator_id');
        $this->addSql('UPDATE tag SET owner_id = creator_id');
        $this->addSql('UPDATE user SET owner_id = creator_id');
        $this->addSql('UPDATE `change` SET owner_id = creator_id');
    }
}
