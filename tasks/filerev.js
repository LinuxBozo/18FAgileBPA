'use strict';

module.exports = function filerev(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-filerev');

    // Options
    return {
        dist: {
            src: [
                'dist/scripts/{,*/}*.js',
                'dist/styles/{,*/}*.css',
                'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                'dist/fonts/*'
            ]
        }
    };
};
