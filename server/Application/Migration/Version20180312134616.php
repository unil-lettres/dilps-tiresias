<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20180312134616 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE card DROP status');
        $this->addSql('ALTER TABLE `card` CHANGE `visibility` `visibility` ENUM(\'private\',\'member\',\'public\') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT \'private\' COMMENT \'(DC2Type:CardVisibility)\';');
        $this->addSql('ALTER TABLE `collection` CHANGE `visibility` `visibility` ENUM(\'private\',\'administrator\',\'member\') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT \'private\' COMMENT \'(DC2Type:CollectionVisibility)\';');
    }
}
