<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Operator;

use Application\Api\Input\Operator\LocalityOrInstitutionLocalityOperatorType;
use Application\Api\Input\Operator\SearchOperatorType;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\User;
use Application\Repository\UserRepository;
use ApplicationTest\Traits\TestWithTransaction;
use GraphQL\Doctrine\Definition\Operator\AbstractOperator;
use GraphQL\Doctrine\Factory\UniqueNameFactory;
use GraphQL\Type\Definition\Type;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class SearchInJoinedEntitiesTest extends TestCase
{
    use TestWithTransaction;

    #[DataProvider('providerSearch')]
    public function testSearch(string $operatorClass, string $term, array $expected): void
    {
        /** @var UserRepository $userRepository */
        $userRepository = _em()->getRepository(User::class);
        User::setCurrent($userRepository->getOneByLogin('administrator', Site::Dilps));

        $connection = _em()->getConnection();
        // Fulltext indexes ignore uncommitted changes, so this hides the institution from them, except for this test
        if ($operatorClass === LocalityOrInstitutionLocalityOperatorType::class) {
            $connection->executeStatement('UPDATE institution SET locality = "Lausanne" WHERE id = 5001');
        }
        $connection->executeStatement('UPDATE card SET institution_id = 5000 WHERE id = 6000');
        $connection->executeStatement('UPDATE card SET institution_id = 5001 WHERE id = 6003');
        $connection->executeStatement('UPDATE card SET country_id = 27 WHERE id = 6004');

        /** @var AbstractOperator $operator */
        $operator = new $operatorClass(_types(), Type::string());
        $metadata = _em()->getClassMetadata(Card::class);
        $qb = _em()->getRepository(Card::class)->createQueryBuilder('card');
        $condition = $operator->getDqlCondition(new UniqueNameFactory(), $metadata, $qb, 'card', 'non-used-field-name', ['value' => $term]);

        $ids = $qb->select('card.id')->where($condition)->orderBy('card.id')->getQuery()->getSingleColumnResult();
        self::assertSame($expected, $ids);
    }

    public static function providerSearch(): iterable
    {
        yield 'institution' => [SearchOperatorType::class, 'institution 5000', [6000]];
        yield 'country' => [SearchOperatorType::class, 'Suède', [6004]];
        yield 'domain, once even if it matches several of its domains' => [SearchOperatorType::class, 'domain', [6001, 6002, 6006, 6007, 6008]];
        yield 'exact term in domain' => [SearchOperatorType::class, '"domain 9003"', [6002]];
        yield 'terms in different domains of the card' => [SearchOperatorType::class, '"domain 9002" "domain 9003"', [6002]];
        yield 'number in domain' => [SearchOperatorType::class, '9003', [6002]];
        yield 'words in different places' => [SearchOperatorType::class, 'card 6000 institution', [6000]];
        yield 'hyphenated words in a joined entity' => [SearchOperatorType::class, 'Test-institution', [6000, 6003]];
        yield 'trailing hyphen in a joined entity' => [SearchOperatorType::class, 'institution-', [6000, 6003]];
        yield 'locality of institution, without fulltext' => [LocalityOrInstitutionLocalityOperatorType::class, 'La', [6003]];
    }
}
