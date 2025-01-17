<?php

declare(strict_types=1);

use Laminas\Diactoros\Stream;
use Laminas\Diactoros\UploadedFile;

return [
    [
        'query' => 'mutation ($inputCard: CardPartialInput!) {
            updateCard(id: 6006 input: $inputCard) {
                name
                fileSize
                width
                height
                institution {
                    name
                }
                artists {
                    name
                }
                datings {
                    from
                    to
                }
            }
        }',
        'variables' => [
            'inputCard' => [
                // Fake a a file uploaded with incorrect data, to check if we trust them (we should not)
                'file' => new UploadedFile(new Stream('data/images/dw4jV3zYSPsqE2CB8BcP8ABD0.jpg'), 999, UPLOAD_ERR_OK, 'image.jpg', 'text/plain'),
                'visibility' => 'Member',
                'dating' => '1980 - 1990',
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
                'institution' => 'test institution',
                'artists' => [
                    'New artist 1',
                    'New artist 2',
                ],
            ],
        ],
    ],
    [
        'data' => [
            'updateCard' => [
                'name' => 'test name',
                'fileSize' => 90188,
                'width' => 960,
                'height' => 425,
                'institution' => [
                    'name' => 'test institution',
                ],
                'artists' => [
                    [
                        'name' => 'New artist 1',
                    ],
                    [
                        'name' => 'New artist 2',
                    ],
                ],
                'datings' => [
                    [
                        'from' => '1980-01-01T00:00:00+00:00',
                        'to' => '1990-12-31T00:00:00+00:00',
                    ],
                ],
            ],
        ],
    ],
];
