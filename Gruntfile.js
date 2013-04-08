module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        'cssmin': {
            all: {
                src: 'css/mailer.css',
                dest: 'css/mailer.min.css'
            }
        },
        uglify: {
            all: {
                src: ['js/vendor/parsley/messages.nl.js', 'js/vendor/parsley.js', 'js/mailer.js'],
                dest: 'js/mailer.min.js'
            }
        },
        clean: [
            'css/mailer.min.css',
            'js/mailer.min.js'
        ],
        watch: {
            js: {
                files: ['js/**/*.js', '!js/**/*.min.js'],
                tasks: ['uglify']
            },
            css: {
                files: ['css/**/*.css', '!css/**/*.min.css'],
                tasks: ['cssmin']
            }

        }
    });

    grunt.registerTask('default', ['cssmin', 'requirejs']);
};