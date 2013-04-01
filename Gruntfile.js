module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

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
                    name: 'vendor/almond',
                    out: 'js/mailer.min.js',
                    include:['mailer'],
                    insertRequire: ['mailer'],
                    wrap: true
                }
            }
        },
        clean: [
            'css/mailer.min.css',
            'js/mailer.min.js'
        ],
        watch: {
            js: {
                files: ['js/**/*.js', '!js/**/*.min.js'],
                tasks: ['requirejs']
            },
            css: {
                files: ['css/**/*.css', '!css/**/*.min.css'],
                tasks: ['cssmin']
            }

        }
    });

    grunt.registerTask('default', ['cssmin', 'requirejs']);
};