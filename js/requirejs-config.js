require.config({
    baseUrl: '/js',
    paths: {
        'parsley': 'vendor/parsley'
    },

    shim: {
        'parsley': {
            deps: ['parsley/messages.nl']
        }
    }
});