<?php

declare(strict_types=1);

return [
    // Like the client batching queries: once the input of tags is used to create one, updating another one must not
    // require the site anymore
    [
        ['query' => 'mutation { createTag(input: {name: "New tag", site: Dilps}) { name } }'],
        ['query' => 'mutation { updateTag(id: 4000, input: {name: "Updated tag"}) { name } }'],
    ],
    [
        [
            'data' => [
                'createTag' => [
                    'name' => 'New tag',
                ],
            ],
        ],
        [
            'data' => [
                'updateTag' => [
                    'name' => 'Updated tag',
                ],
            ],
        ],
    ],
];
