<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

class Version20221117163523 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Some cards have empty plain_name, even tough they never should, so we re-affect them here
        $this->addSql("UPDATE card SET plain_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, '<strong>', ''), '</strong>', ''), '<em>', ''), '</em>', ''), '<u>', ''), '</u>', '') WHERE plain_name = ''");

        // Convert unbreakable spaces into normal spaces
        $unbreakable = html_entity_decode('&nbsp;');
        $this->addSql(
            <<<STRING
                UPDATE `card` SET
                    name = REPLACE(REPLACE(name, '&nbsp;', ' '), '$unbreakable', ' '),
                    expanded_name = REPLACE(REPLACE(expanded_name, '&nbsp;', ' '), '$unbreakable', ' '),
                    literature = REPLACE(REPLACE(literature, '&nbsp;', ' '), '$unbreakable', ' '),
                    corpus = REPLACE(REPLACE(corpus, '&nbsp;', ' '), '$unbreakable', ' '),
                    url_description = REPLACE(REPLACE(url_description, '&nbsp;', ' '), '$unbreakable', ' '),
                    plain_name = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(plain_name,
                        '&nbsp;', ' '),
                       '$unbreakable', ' '),
                       '&amp;', '&'),
                       '&gt;', '>'),
                       '&lt;', '<'),
                       '&quot;', '"')
                STRING
        );
    }
}
