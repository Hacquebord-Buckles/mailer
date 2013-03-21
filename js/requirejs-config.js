require.config({
    baseUrl: '/js',
    paths: {
        'jquery': 'vendor/jquery-1.9.1',
        'parsley': 'vendor/parsley'
    },

    shim: {
        'parsley': {
            deps: ['jquery', 'parsley/messages.nl']
        },
        'parsley/messages.nl': {
            deps: ['jquery']
        }
    }
});