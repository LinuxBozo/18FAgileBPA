'use strict';

module.exports = function watch(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-watch');

    return {
        options: {
            livereload: true
        },
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
                livereload: false,
                spawn: false
            }
        },
        sass: {
            files: ['public/styles/**/*.scss'],
            tasks: ['sass:serve', 'copy:styles']
        },
        js: {
            files: ['public/scripts/**/*.js'],
            tasks: ['jscs:all', 'jshint', 'browserify:dev']
        },
        livereload: {
            files: [
              'public/**/*.html',
              'public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
            ]
        }
    };
};
