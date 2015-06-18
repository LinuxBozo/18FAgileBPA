'use strict';

module.exports = function ngAnnotate(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-ng-annotate');

    // Options
    return {
        options: {
            singleQuotes: true
        },
        dist: {
            files: [{
                expand: true,
                cwd: 'public/bundle',
                src: '{,*/}*.js',
                dest: 'public/bundle'
            }]
        }
    };
};
