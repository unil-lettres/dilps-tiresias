<?php

declare(strict_types=1);

namespace Application\Api\Field\Query;

use Application\Api\Field\Mutation\CreateExport;
use Application\Api\Input\CreateExportInputType;
use Ecodev\Felix\Api\Field\FieldInterface;
use GraphQL\Error\ClientAware;
use GraphQL\Type\Definition\Type;

class ValidateExport implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'validateExport',
            'type' => Type::string(),
            'description' => 'Validates that a new export can indeed be created. If valid return `null`, else return a message to be shown to end-user.',
            'args' => [
                'input' => Type::nonNull(_types()->get(CreateExportInputType::class)),
            ],
            'resolve' => function (array $root, array $args): ?string {
                _em()->beginTransaction();

                try {
                    CreateExport::create($args);
                } catch (ClientAware $e) {
                    return $e->getMessage();
                } finally {
                    // Never keep things in DB
                    _em()->rollback();
                }

                return null;
            },
        ];
    }
}
