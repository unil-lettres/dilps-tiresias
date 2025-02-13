<?php

declare(strict_types=1);

use Laminas\Diactoros\Stream;
use Laminas\Diactoros\UploadedFile;

return [
    [
        'query' => 'mutation ($inputCard: CardInput!, $collection: CollectionID) {
            createCard(input: $inputCard, collection: $collection) {
                name
                fileSize
                width
                height
                code
                artists {
                    name
                }
                collections {
                    id
                }
            }
        }',
        'variables' => [
            'inputCard' => [
                // Fake a a file uploaded with incorrect data, to check if we trust them (we should not)
                'file' => new UploadedFile(new Stream('data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg'), 999, UPLOAD_ERR_OK, 'card.jpg', 'text/plain'),
                'site' => Application\Enum\Site::Dilps,
                'visibility' => 'Member',
                'dating' => 'test dating',
                'addition' => 'test addition',
                'expandedName' => 'test expandedName',
                'material' => 'test material',
                'techniqueAuthor' => 'test techniqueAuthor',
                'format' => 'test format',
                'literature' => 'test literature',
                'page' => 'test page',
                'figure' => 'test figure',
                'table' => 'test table',
                'isbn' => 'test isbn',
                'comment' => 'test comment',
                'rights' => 'test rights',
                'muserisUrl' => 'test muserisUrl',
                'muserisCote' => 'test muserisCote',
                'name' => 'test name',
                'street' => 'test street',
                'postcode' => 'test postcode',
                'locality' => 'test locality',
                'area' => 'test street',
                'artists' => [
                    'Test artist 3000',
                    'New artist',
                ],
                'materials' => ['2000', '2001'],
                'tags' => ['2000', '2001'],
                'periods' => ['2000', '2001'],
                'antiqueNames' => ['2000', '2001'],
            ],
        ],
    ],
    [
        'data' => [
            'createCard' => [
                'name' => 'test name',
                'fileSize' => 90188,
                'width' => 960,
                'height' => 425,
                'code' => null,
                'artists' => [
                    [
                        'name' => 'Test artist 3000',
                    ],
                    [
                        'name' => 'New artist',
                    ],
                ],
                'collections' => [],
            ],
        ],
    ],
];
