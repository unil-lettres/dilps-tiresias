<?php

declare(strict_types=1);

namespace Application\Api\Input;

use Application\Enum\ExportFormat;
use Application\Enum\Site;
use Application\Model\Card;
use Application\Model\Collection;
use Ecodev\Felix\Api\Scalar\ColorType;
use GraphQL\Type\Definition\InputObjectType;

class CreateExportInputType extends InputObjectType
{
    public function __construct()
    {
        // Here we use non-standard input to inject collections and cards for which we do not want setters in model
        $config = [
            'description' => 'An export of cards in various format',
            'fields' => fn (): array => [
                'format' => [
                    'type' => _types()->get(ExportFormat::class),
                    'defaultValue' => ExportFormat::Zip,
                ],
                'maxHeight' => [
                    'type' => self::int(),
                    'defaultValue' => 0,
                ],
                'includeLegend' => [
                    'type' => self::boolean(),
                    'defaultValue' => true,
                ],
                'textColor' => [
                    'type' => _types()->get(ColorType::class),
                    'defaultValue' => '#FFFFFF',
                ],
                'backgroundColor' => [
                    'type' => _types()->get(ColorType::class),
                    'defaultValue' => '#000000',
                ],
                'site' => [
                    'type' => self::nonNull(_types()->get(Site::class)),
                ],
                'collections' => [
                    'type' => self::nonNull(self::listOf(self::nonNull(_types()->getId(Collection::class)))),
                    'defaultValue' => [],
                ],
                'cards' => [
                    'type' => self::nonNull(self::listOf(self::nonNull(_types()->getId(Card::class)))),
                    'defaultValue' => [],
                ],
            ],
        ];

        parent::__construct($config);
    }
}
