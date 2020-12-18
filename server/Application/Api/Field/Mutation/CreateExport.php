<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Helper;
use Application\Api\Input\CreateExportInputType;
use Application\Model\Export;
use Application\Repository\ExportRepository;
use Application\Service\Exporter\Exporter;
use Ecodev\Felix\Api\Field\FieldInterface;
use Ecodev\Felix\Utility;
use GraphQL\Type\Definition\Type;

/**
 * Custom implementation to inject lots of cards via collection without loading each cards
 */
class CreateExport implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createExport',
            'type' => Type::nonNull(_types()->getOutput(Export::class)),
            'description' => 'Create a new export',
            'args' => [
                'input' => Type::nonNull(_types()->get(CreateExportInputType::class)),
            ],
            'resolve' => function (array $root, array $args): Export {
                global $container;

                /** @var Exporter $exporter */
                $exporter = $container->get(Exporter::class);

                // Check ACL
                $export = new Export();
                $input = $args['input'];

                $collectionIds = Utility::modelToId($input['collections']);
                $cardIds = Utility::modelToId($input['cards']);
                unset($input['collections'], $input['cards']);

                // Be sure that site is set first
                Helper::hydrate($export, ['site' => $input['site']]);

                // Check ACL
                Helper::throwIfDenied($export, 'create');

                // Do it
                Helper::hydrate($export, $input);

                _em()->persist($export);
                _em()->flush();

                // Actually inject all selected cards into export (either hand-picked or via collection)
                /** @var ExportRepository $exportRepository */
                $exportRepository = _em()->getRepository(Export::class);
                $cardCount = $exportRepository->updateCards($export, $collectionIds, $cardIds);

                // Do small export right now, do big one async
                if ($cardCount < 200) {
                    // Refresh export so we can properly load card from DB
                    _em()->refresh($export);
                    $exporter->export($export);
                } else {
                    $exporter->exportAsync($export);
                }

                return $export;
            },
        ];
    }
}
