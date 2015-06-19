'use strict';

module.exports = function uglify(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Options
    return {
        dist: {
            files: {
                'dist/scripts/scripts.js': [
                    'dist/scripts/scripts.js'
                ]
            }
        }
    };
};
