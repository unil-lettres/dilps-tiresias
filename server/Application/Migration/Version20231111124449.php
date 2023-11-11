<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20231111124449 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE antique_name CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE artist CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE card CHANGE visibility visibility ENUM(\'private\', \'member\', \'public\') DEFAULT \'private\' NOT NULL COMMENT \'(FelixEnum:85663457bba117265035d52707fb8997)(DC2Type:CardVisibility)\', CHANGE `precision` `precision` ENUM(\'locality\', \'site\', \'building\') DEFAULT NULL COMMENT \'(FelixEnum:02f8fc408689fd90cf164dad2c9bd1ed)(DC2Type:Precision)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE `change` CHANGE type type ENUM(\'create\', \'update\', \'delete\') DEFAULT \'update\' NOT NULL COMMENT \'(FelixEnum:e462ec89fb90218a3b982c3fa255dbb2)(DC2Type:ChangeType)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE collection CHANGE visibility visibility ENUM(\'private\', \'administrator\', \'member\') DEFAULT \'private\' NOT NULL COMMENT \'(FelixEnum:0dc99c2ece45aedf7fa37f8fa4bbb9bd)(DC2Type:CollectionVisibility)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE document_type CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE domain CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE export CHANGE status status ENUM(\'todo\', \'in_progress\', \'done\', \'errored\') DEFAULT \'todo\' NOT NULL COMMENT \'(FelixEnum:d79c40a4235333b44535d636f533419d)(DC2Type:ExportStatus)\', CHANGE format format ENUM(\'zip\', \'pptx\', \'csv\') DEFAULT \'zip\' NOT NULL COMMENT \'(FelixEnum:428958a37a90c4716c2a20e04c34e735)(DC2Type:ExportFormat)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE institution CHANGE `precision` `precision` ENUM(\'locality\', \'site\', \'building\') DEFAULT NULL COMMENT \'(FelixEnum:02f8fc408689fd90cf164dad2c9bd1ed)(DC2Type:Precision)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE material CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE message CHANGE type type ENUM(\'export_done\') NOT NULL COMMENT \'(FelixEnum:726f495c112d89a4d032834a39f0fc68)(DC2Type:MessageType)\'');
        $this->addSql('ALTER TABLE news CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE period CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE statistic CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE tag CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
        $this->addSql('ALTER TABLE user CHANGE type type ENUM(\'default\', \'aai\', \'legacy\') DEFAULT \'default\' NOT NULL COMMENT \'(FelixEnum:3ab2b86f682a5e82fbb96b77e478a3ff)(DC2Type:UserType)\', CHANGE role role ENUM(\'student\', \'junior\', \'senior\', \'major\', \'administrator\') DEFAULT \'student\' NOT NULL COMMENT \'(FelixEnum:208002ddd72970f97c7204d154fa3c2b)(DC2Type:UserRole)\', CHANGE site site ENUM(\'dilps\', \'tiresias\') NOT NULL COMMENT \'(FelixEnum:861b59406c30458e22cfe0b2002e0d81)(DC2Type:Site)\'');
    }
}
