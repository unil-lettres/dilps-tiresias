<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221010154735 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Delete all triggers, because they are a huge slow-down when updating each records. They will be recreated after migration
        $triggers = $this->connection->executeQuery('SHOW TRIGGERS;')->fetchFirstColumn();
        foreach ($triggers as $trigger) {
            $this->addSql("DROP TRIGGER `$trigger`");
        }

        $this->addSql('UPDATE `card` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `artist` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `institution` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `domain` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `log` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `period` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `message` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `news` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `statistic` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `material` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `country` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `antique_name` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `change` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `dating` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `tag` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `export` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `collection` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `document_type` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `user` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
        $this->addSql('UPDATE `file` SET updater_id = creator_id, update_date = creation_date WHERE updater_id IS NULL AND update_date IS NULL;');
    }
}
