<?php

return [
    'paths' => ['api/*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('FRONTEND_URLS', 'http://web.nextrep.test:5173,http://web.nextrep.test')),
    ))),

    'allowed_methods' => ['*'],
    'allowed_headers' => ['*'],

    'allowed_origins_patterns' => [],
    'exposed_headers' => [],
    'max_age' => 0,

    'supports_credentials' => false,
];
