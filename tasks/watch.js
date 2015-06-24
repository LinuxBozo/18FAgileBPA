'use strict';

module.exports = function watch(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-watch');

    return {
        server: {
            files: [
                'index.js',
                'lib/*.js',
                'models/*.js',
                'services/**/*.js',
                'controllers/**/*.js'
            ],
            tasks: ['jscs:all', 'jshint', 'develop'],
            options: {
                spawn: false
            }
        },
        client: {
            files: [
                'public/**/*',
                '!public/bundle/*.js'
            ],
            tasks: ['jscs:all', 'jshint', 'browserify:dev', 'build'],
            options: {
                livereload: true
            }
        }
    };

};
