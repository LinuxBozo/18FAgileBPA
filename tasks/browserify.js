'use strict';

module.exports = function browserify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-browserify');

    // Options
    return {
        dev: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            src: 'public/scripts/app.js',
            dest: 'public/bundle/bundle.js'
        },
        dist: {
            options: {
                browserifyOptions: {
                    debug: false
                }
            },
            src: 'public/scripts/app.js',
            dest: 'public/bundle/bundle.js'
        }
    };
};
