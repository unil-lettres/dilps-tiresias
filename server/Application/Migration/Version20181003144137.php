<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;
use Ecodev\Felix\Migration\IrreversibleMigration;

class Version20181003144137 extends IrreversibleMigration
{
    public function up(Schema $schema): void
    {
        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2451911\',
\'2488434\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XXI(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2415386\',
\'2451910\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XX(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2378862\',
\'2415385\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XIX(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2342338\',
\'2378861\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XVIII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2305814\',
\'2342337\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XVII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2269289\',
\'2305813\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XVI(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2232765\',
\'2269288\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XV(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2196241\',
\'2232764\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XIV(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2159717\',
\'2196240\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XIII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2123192\',
\'2159716\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2086668\',
\'2123191\'
FROM card WHERE dating REGEXP \'(\\\\W|^)XI(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2050144\',
\'2086667\'
FROM card WHERE dating REGEXP \'(\\\\W|^)X(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'2013620\',
\'2050143\'
FROM card WHERE dating REGEXP \'(\\\\W|^)IX(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1977095\',
\'2013619\'
FROM card WHERE dating REGEXP \'(\\\\W|^)VIII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1940571\',
\'1977094\'
FROM card WHERE dating REGEXP \'(\\\\W|^)VII(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1904047\',
\'1940570\'
FROM card WHERE dating REGEXP \'(\\\\W|^)VI(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1867523\',
\'1904046\'
FROM card WHERE dating REGEXP \'(\\\\W|^)V(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1830998\',
\'1867522\'
FROM card WHERE dating REGEXP \'(\\\\W|^)IV(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1794474\',
\'1830997\'
FROM card WHERE dating REGEXP \'(\\\\W|^)III(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1757950\',
\'1794473\'
FROM card WHERE dating REGEXP \'(\\\\W|^)II(e|ème|)(\\\\W|$)\'');

        $this->addSql('INSERT INTO dating (creation_date, creator_id, owner_id, card_id, `from`, `to`) SELECT 
NOW(),
creator_id,
owner_id,
id,
\'1721426\',
\'1757949\'
FROM card WHERE dating REGEXP \'(\\\\W|^)I(e|ème|)(\\\\W|$)\'');
    }
}
