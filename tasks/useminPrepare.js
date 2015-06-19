'use strict';

module.exports = function useminPrepare(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-usemin');

    // Options
    return {
        html: 'public/index.html',
        options: {
            dest: 'dist',
            flow: {
                html: {
                    steps: {
                        js: ['uglifyjs'],
                        css: ['cssmin']
                    },
                    post: {}
                }
            }
        }
    };
};
