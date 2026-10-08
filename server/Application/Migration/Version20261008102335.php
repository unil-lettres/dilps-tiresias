<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20261008102335 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Forget who created or updated objects when that user is deleted, instead of refusing to delete the user,
        // eg: because of the log of their login. The owner is kept as is, so owned objects still prevent it.
        $this->addSql('ALTER TABLE antique_name DROP FOREIGN KEY `FK_8655404061220EA6`');
        $this->addSql('ALTER TABLE antique_name DROP FOREIGN KEY `FK_86554040E37ECFB0`');
        $this->addSql('ALTER TABLE antique_name ADD CONSTRAINT FK_8655404061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE antique_name ADD CONSTRAINT FK_86554040E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE artist DROP FOREIGN KEY `FK_159968761220EA6`');
        $this->addSql('ALTER TABLE artist DROP FOREIGN KEY `FK_1599687E37ECFB0`');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_159968761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE artist ADD CONSTRAINT FK_1599687E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY `FK_161498D361220EA6`');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY `FK_161498D3E37ECFB0`');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `change` DROP FOREIGN KEY `FK_4057FE2061220EA6`');
        $this->addSql('ALTER TABLE `change` DROP FOREIGN KEY `FK_4057FE20E37ECFB0`');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE2061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `change` ADD CONSTRAINT FK_4057FE20E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE collection DROP FOREIGN KEY `FK_FC4D653261220EA6`');
        $this->addSql('ALTER TABLE collection DROP FOREIGN KEY `FK_FC4D6532E37ECFB0`');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D653261220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE collection ADD CONSTRAINT FK_FC4D6532E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE country DROP FOREIGN KEY `FK_5373C96661220EA6`');
        $this->addSql('ALTER TABLE country DROP FOREIGN KEY `FK_5373C966E37ECFB0`');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C96661220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C966E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE dating DROP FOREIGN KEY `FK_D06C7A461220EA6`');
        $this->addSql('ALTER TABLE dating DROP FOREIGN KEY `FK_D06C7A4E37ECFB0`');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE dating ADD CONSTRAINT FK_D06C7A4E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE document_type DROP FOREIGN KEY `FK_2B6ADBBA61220EA6`');
        $this->addSql('ALTER TABLE document_type DROP FOREIGN KEY `FK_2B6ADBBAE37ECFB0`');
        $this->addSql('ALTER TABLE document_type ADD CONSTRAINT FK_2B6ADBBA61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE document_type ADD CONSTRAINT FK_2B6ADBBAE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE domain DROP FOREIGN KEY `FK_A7A91E0B61220EA6`');
        $this->addSql('ALTER TABLE domain DROP FOREIGN KEY `FK_A7A91E0BE37ECFB0`');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0B61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0BE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE export DROP FOREIGN KEY `FK_428C169461220EA6`');
        $this->addSql('ALTER TABLE export DROP FOREIGN KEY `FK_428C1694E37ECFB0`');
        $this->addSql('ALTER TABLE export ADD CONSTRAINT FK_428C169461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE export ADD CONSTRAINT FK_428C1694E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file DROP FOREIGN KEY `FK_8C9F361061220EA6`');
        $this->addSql('ALTER TABLE file DROP FOREIGN KEY `FK_8C9F3610E37ECFB0`');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F361061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F3610E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE institution DROP FOREIGN KEY `FK_3A9F98E561220EA6`');
        $this->addSql('ALTER TABLE institution DROP FOREIGN KEY `FK_3A9F98E5E37ECFB0`');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE institution ADD CONSTRAINT FK_3A9F98E5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE log DROP FOREIGN KEY `FK_8F3F68C561220EA6`');
        $this->addSql('ALTER TABLE log DROP FOREIGN KEY `FK_8F3F68C5E37ECFB0`');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE material DROP FOREIGN KEY `FK_7CBE759561220EA6`');
        $this->addSql('ALTER TABLE material DROP FOREIGN KEY `FK_7CBE7595E37ECFB0`');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE759561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE material ADD CONSTRAINT FK_7CBE7595E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY `FK_B6BD307F61220EA6`');
        $this->addSql('ALTER TABLE message DROP FOREIGN KEY `FK_B6BD307FE37ECFB0`');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE news DROP FOREIGN KEY `FK_1DD3995061220EA6`');
        $this->addSql('ALTER TABLE news DROP FOREIGN KEY `FK_1DD39950E37ECFB0`');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD3995061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD39950E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE period DROP FOREIGN KEY `FK_C5B81ECE61220EA6`');
        $this->addSql('ALTER TABLE period DROP FOREIGN KEY `FK_C5B81ECEE37ECFB0`');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECE61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE period ADD CONSTRAINT FK_C5B81ECEE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE statistic DROP FOREIGN KEY `FK_649B469C61220EA6`');
        $this->addSql('ALTER TABLE statistic DROP FOREIGN KEY `FK_649B469CE37ECFB0`');
        $this->addSql('ALTER TABLE statistic ADD CONSTRAINT FK_649B469C61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE statistic ADD CONSTRAINT FK_649B469CE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE tag DROP FOREIGN KEY `FK_389B78361220EA6`');
        $this->addSql('ALTER TABLE tag DROP FOREIGN KEY `FK_389B783E37ECFB0`');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B78361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE tag ADD CONSTRAINT FK_389B783E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY `FK_8D93D64961220EA6`');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY `FK_8D93D649E37ECFB0`');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
    }
}
