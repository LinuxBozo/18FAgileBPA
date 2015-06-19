'use strict';

module.exports = function usemin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-usemin');

    // Options
    return {
        html: ['dist/{,*/}*.html'],
        css: ['dist/styles/{,*/}*.css'],
        options: {
            assetsDirs: ['dist', 'dist/images']
        }
    };
};
