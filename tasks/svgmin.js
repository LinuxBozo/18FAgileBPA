'use strict';

module.exports = function svgmin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-svgmin');

    // Options
    return {
        dist: {
            files: [{
                expand: true,
                cwd: 'public/images',
                src: '{,*/}*.svg',
                dest: 'dist/images'
            }]
        }
    };
};
