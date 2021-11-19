<?php

declare(strict_types=1);

namespace Application\Api\Field;

use Application\Api\Helper;
use Application\Model\AbstractModel;
use Application\Model\Card;
use Application\Repository\AbstractRepository;
use Doctrine\ORM\Mapping\ClassMetadata;
use Ecodev\Felix\Api\Input\PaginationInputType;
use GraphQL\Type\Definition\Type;
use ReflectionClass;

/**
 * Provide easy way to build standard fields to query and mutate objects.
 */
abstract class Standard
{
    /**
     * Returns standard fields to query the object.
     */
    public static function buildQuery(string $class): array
    {
        $metadata = _em()->getClassMetadata($class);
        $reflect = $metadata->getReflectionClass();
        $name = lcfirst($reflect->getShortName());
        $shortName = $reflect->getShortName();
        $plural = self::makePlural($name);

        $listArgs = self::getListArguments($metadata, $class, $name);
        $singleArgs = self::getSingleArguments($class);

        return [
            [
                'name' => $plural,
                'type' => _types()->get($shortName . 'Pagination'),
                'args' => $listArgs,
                'resolve' => function (array $root, array $args) use ($class, $metadata): array {
                    // If null or empty list is provided by client, fallback on default sorting
                    $sorting = $args['sorting'] ?? [];
                    if (!$sorting) {
                        $sorting = self::getDefaultSorting($metadata);
                    }

                    // And **always** sort by ID
                    $sorting[] = [
                        'field' => 'id',
                        'order' => 'ASC',
                    ];

                    $qb = _types()->createFilteredQueryBuilder($class, $args['filter'] ?? [], $sorting);

                    $result = Helper::paginate($args['pagination'], $qb);

                    return $result;
                },
            ],
            [
                'name' => $name,
                'type' => _types()->getOutput($class),
                'args' => $singleArgs,
                'resolve' => function (array $root, array $args): ?AbstractModel {
                    $object = $args['id']->getEntity();

                    Helper::throwIfDenied($object, 'read');

                    return $object;
                },
            ],
        ];
    }

    /**
     * Returns standard fields to mutate the object.
     */
    public static function buildMutation(string $class): array
    {
        $reflect = new ReflectionClass($class);
        $name = $reflect->getShortName();
        $plural = self::makePlural($name);

        return [
            [
                'name' => 'create' . $name,
                'type' => Type::nonNull(_types()->getOutput($class)),
                'description' => 'Create a new ' . $name,
                'args' => [
                    'input' => Type::nonNull(_types()->getInput($class)),
                ],
                'resolve' => function (array $root, array $args) use ($class): AbstractModel {
                    $object = new $class();

                    // Be sure that site is set first
                    $input = $args['input'];
                    if ($input['site'] ?? false) {
                        Helper::hydrate($object, ['site' => $input['site']]);
                    }

                    if ($input['card'] ?? false) {
                        Helper::hydrate($object, ['card' => $input['card']]);
                    }

                    // Check ACL
                    Helper::throwIfDenied($object, 'create');

                    // Do it
                    Helper::hydrate($object, $input);
                    _em()->persist($object);
                    _em()->flush();

                    return $object;
                },
            ],
            [
                'name' => 'update' . $name,
                'type' => Type::nonNull(_types()->getOutput($class)),
                'description' => 'Update an existing ' . $name,
                'args' => [
                    'id' => Type::nonNull(_types()->getId($class)),
                    'input' => Type::nonNull(_types()->getPartialInput($class)),
                ],
                'resolve' => function (array $root, array $args): AbstractModel {
                    $object = $args['id']->getEntity();

                    // Check ACL
                    Helper::throwIfDenied($object, 'update');

                    // Do it
                    $input = $args['input'];
                    Helper::hydrate($object, $input);

                    _em()->flush();

                    return $object;
                },
            ],
            [
                'name' => 'delete' . $plural,
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'Delete one or several existing ' . $name,
                'args' => [
                    'ids' => Type::nonNull(Type::listOf(Type::nonNull(_types()->getId($class)))),
                ],
                'resolve' => function (array $root, array $args): bool {
                    foreach ($args['ids'] as $id) {
                        $object = $id->getEntity();

                        // Check ACL
                        Helper::throwIfDenied($object, 'update');

                        // Do it
                        _em()->remove($object);
                    }

                    _em()->flush();

                    return true;
                },
            ],
        ];
    }

    /**
     * Returns standard mutations to manage many-to-many relations between two given class.
     *
     * @param string $ownerClass The class owning the relation
     * @param string $otherClass The other class, not-owning the relation
     * @param bool $byName if true, the name of $other will define the relation instead of its ID
     * @param string $privilege the ACL privilege to assert before linking, usually "update", but in edge cases a custom one
     */
    public static function buildRelationMutation(string $ownerClass, string $otherClass, bool $byName = false, string $privilege = 'update'): array
    {
        $ownerReflect = new ReflectionClass($ownerClass);
        $ownerName = $ownerReflect->getShortName();
        $lowerOwnerName = lcfirst($ownerName);

        $otherReflect = new ReflectionClass($otherClass);
        $otherName = $otherReflect->getShortName();
        $lowerOtherName = lcfirst($otherName);

        if ($lowerOwnerName === $lowerOtherName) {
            $lowerOwnerName .= 1;
            $lowerOtherName .= 2;
        }

        $args = [
            $lowerOwnerName => Type::nonNull(_types()->getId($ownerClass)),
            $lowerOtherName => Type::nonNull($byName ? Type::string() : _types()->getId($otherClass)),
        ];

        return [
            [
                'name' => 'link' . $ownerName . $otherName,
                'type' => Type::nonNull(_types()->getOutput($ownerClass)),
                'description' => 'Create a relation between ' . $ownerName . ' and ' . $otherName . '.' . PHP_EOL . PHP_EOL
                    . 'If the relation already exists, it will have no effect.',
                'args' => $args,
                'resolve' => function (array $root, array $args) use ($lowerOwnerName, $lowerOtherName, $otherName, $otherClass, $byName, $privilege): AbstractModel {
                    $owner = $args[$lowerOwnerName]->getEntity();
                    if ($byName) {
                        $other = self::getByName($otherClass, $args[$lowerOtherName], true);
                    } else {
                        $other = $args[$lowerOtherName]->getEntity();
                    }

                    // If privilege is linkCard, exceptionally test ACL on other, instead of owner, because other is the collection to which a card will be added
                    $objectForAcl = $privilege === 'linkCard' ? $other : $owner;

                    // Check ACL
                    Helper::throwIfDenied($objectForAcl, $privilege);

                    // Do it
                    $method = 'add' . $otherName;
                    $owner->$method($other);
                    _em()->flush();

                    return $owner;
                },
            ],
            [
                'name' => 'unlink' . $ownerName . $otherName,
                'type' => Type::nonNull(_types()->getOutput($ownerClass)),
                'description' => 'Delete a relation between ' . $ownerName . ' and ' . $otherName . '.' . PHP_EOL . PHP_EOL
                    . 'If the relation does not exist, it will have no effect.',
                'args' => $args,
                'resolve' => function (array $root, array $args) use ($lowerOwnerName, $lowerOtherName, $otherName, $otherClass, $byName, $privilege): AbstractModel {
                    $owner = $args[$lowerOwnerName]->getEntity();
                    if ($byName) {
                        $other = self::getByName($otherClass, $args[$lowerOtherName], false);
                    } else {
                        $other = $args[$lowerOtherName]->getEntity();
                    }

                    // If privilege is linkCard, exceptionally test ACL on other, instead of owner, because other is the collection to which a card will be added
                    $objectForAcl = $privilege === 'linkCard' ? $other : $owner;

                    // Check ACL
                    Helper::throwIfDenied($objectForAcl, $privilege);

                    // Do it
                    if ($other) {
                        $method = 'remove' . $otherName;
                        $owner->$method($other);
                        _em()->flush();
                    }

                    return $owner;
                },
            ],
        ];
    }

    /**
     * Load object from DB and optionally create new one if not found.
     */
    private static function getByName(string $class, string $name, bool $createIfNotFound): ?AbstractModel
    {
        $name = trim($name);
        /** @var AbstractRepository $entityRepository */
        $entityRepository = _em()->getRepository($class);
        $other = $entityRepository->findOneByName($name);

        if (!$other && $createIfNotFound) {
            $other = new $class();
            $other->setName($name);
            _em()->persist($other);
        }

        return $other;
    }

    /**
     * Returns the plural form of the given name.
     */
    private static function makePlural(string $name): string
    {
        $plural = $name . 's';
        $plural = preg_replace('/ys$/', 'ies', $plural);
        $plural = preg_replace('/ss$/', 'ses', $plural);

        return $plural;
    }

    /**
     * Return arguments used for the list.
     */
    private static function getListArguments(ClassMetadata $class, string $classs, string $name): array
    {
        $listArgs = [
            [
                'name' => 'filter',
                'type' => _types()->getFilter($class->getName()),
            ],
            [
                'name' => 'sorting',
                'type' => _types()->getSorting($class->getName()),
                'defaultValue' => self::getDefaultSorting($class),
            ],
        ];

        $listArgs[] = PaginationInputType::build(_types());

        return $listArgs;
    }

    /**
     * Return arguments used for single item.
     */
    private static function getSingleArguments(string $class): array
    {
        $args = [
            'id' => Type::nonNull(_types()->getId($class)),
        ];

        return $args;
    }

    /**
     * Get default sorting values with some fallback for some special cases.
     */
    private static function getDefaultSorting(ClassMetadata $class): array
    {
        $defaultSorting = [];
        if ($class->getName() === Card::class) {
            $defaultSorting[] = [
                'field' => 'creationDate',
                'order' => 'DESC',
            ];
        }

        if ($class->hasField('sorting')) {
            $defaultSorting[] = [
                'field' => 'sorting',
                'order' => 'ASC',
            ];
        }

        if ($class->hasField('name')) {
            $defaultSorting[] = [
                'field' => 'name',
                'order' => 'ASC',
            ];
        }

        return $defaultSorting;
    }
}
