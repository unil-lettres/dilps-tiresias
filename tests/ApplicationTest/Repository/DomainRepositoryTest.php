<?php

declare(strict_types=1);

namespace ApplicationTest\Repository;

use Application\Enum\Site;
use Application\Model\Domain;
use Application\Model\User;
use Application\Repository\DomainRepository;

class DomainRepositoryTest extends AbstractRepositoryTest
{
    private DomainRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = _em()->getRepository(Domain::class);
    }

    public function testGetFullNames(): void
    {
        $actual = $this->repository->getFullNames(Site::Tiresias);
        $expected = [
            'Test domain 9000' => 9000,
            'Test domain 9001' => 9001,
        ];
        self::assertSame($expected, $actual);

        $actual = $this->repository->getFullNames(Site::Dilps);
        $expected = [
            'Test domain 9002' => 9002,
            'Test domain 9003' => 9003,
        ];
        self::assertSame($expected, $actual);
    }

    public function testGetSelfAndDescendantsSubQuery(): void
    {
        $expected = [
            ['id' => 9000],
        ];

        $sql = $this->repository->getSelfAndDescendantsSubQuery(9000);
        $actual = _em()->getConnection()->fetchAllAssociative($sql);
        self::assertSame($expected, $actual);
    }

    /**
     * @dataProvider providerGetByCards
     */
    public function testGetByCards(?string $userLogin, array $filter, array $expectedDomainIds, string $message): void
    {
        if ($userLogin) {
            $userRepository = _em()->getRepository(User::class);
            $user = $userRepository->getOneByLogin($userLogin, Site::Dilps);
            User::setCurrent($user);
        } else {
            User::setCurrent(null);
        }

        $result = $this->repository->getByCards($filter);
        $actualDomainIds = array_map(fn (Domain $domain) => $domain->getId(), $result);

        self::assertSame($expectedDomainIds, $actualDomainIds, $message);
    }

    public static function providerGetByCards(): iterable
    {
        // Test with administrator - should see all domains from accessible cards
        yield 'administrator sees all domains' => [
            'administrator',
            [
                'groups' => [
                    [
                        'groupLogic' => 'AND',
                        'conditionsLogic' => 'AND',
                        'conditions' => [
                            [
                                'site' => ['equal' => ['value' => Site::Dilps, 'not' => false]],
                            ],
                            [
                                'filename' => ['equal' => ['value' => '', 'not' => true]],
                            ],
                        ],
                    ],
                ],
            ],
            [9002, 9003], // Domains from cards 6001, 6002 (both have domains)
            'Administrator should see all domains from Dilps cards',
        ];

        // Test with junior user (user 1002) - has limited access
        yield 'junior sees accessible domains' => [
            'junior',
            [
                'groups' => [
                    [
                        'groupLogic' => 'AND',
                        'conditionsLogic' => 'AND',
                        'conditions' => [
                            [
                                'site' => ['equal' => ['value' => Site::Dilps, 'not' => false]],
                            ],
                            [
                                'filename' => ['equal' => ['value' => '', 'not' => true]],
                            ],
                        ],
                    ],
                ],
            ],
            [9002], // Junior (user 1002) owns card 6006 with domain 9002, but cannot see private cards 6001, 6002
            'Junior should see only domain from own card, not from private cards',
        ];

        // Test with search term filter (complexe query parameters)
        yield 'filter by search term' => [
            'administrator',
            [
                'groups' => [
                    [
                        'groupLogic' => 'AND',
                        'conditionsLogic' => 'AND',
                        'conditions' => [
                            [
                                'custom' => ['search' => ['value' => 'Test suggestion card 6001']],
                            ],
                        ],
                    ],
                ],
            ],
            [9002], // Card 6001 has domain 9002
            'Should return domains from card 6001',
        ];

        // Test empty result
        yield 'no cards match filter' => [
            'administrator',
            [
                'groups' => [
                    [
                        'groupLogic' => 'AND',
                        'conditionsLogic' => 'AND',
                        'conditions' => [
                            [
                                'id' => ['equal' => ['value' => '99999', 'not' => false]],
                            ],
                        ],
                    ],
                ],
            ],
            [],
            'Should return empty array when no cards match',
        ];
    }
}
