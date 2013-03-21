module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        'cssmin': {
            all: {
                src: 'css/mailer.css',
                dest: 'css/mailer.min.css'
            }
        },
        'requirejs': {
            'compile': {
                options: {
                    baseUrl: 'js',
                    mainConfigFile: 'js/requirejs-config.js',
                    name: 'mailer',
                    out: 'js/mailer.min.js'
                }
            }
        },
        clean: [
            'css/mailer.min.css',
            'js/mailer.min.js'
        ]
    });

    grunt.registerTask('default', ['cssmin', 'requirejs']);
};