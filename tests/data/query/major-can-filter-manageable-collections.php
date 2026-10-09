<?php

declare(strict_types=1);

return [
    [
        'query' => '{
            collections(filter: {groups: [
                {conditions: [{id: {in: {values: [2001, 2002]}}}]}
                {conditions: [{custom: {manageableByViewer: {value: true}}}]}
            ]}) {
                items { id }
            }
        }',
    ],
    [
        'data' => [
            'collections' => [
                'items' => [
                    // major (1009) may add images to any collection they see, even without owning it
                    ['id' => '2001'],
                    ['id' => '2002'],
                ],
            ],
        ],
    ],
];
