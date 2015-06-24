'use strict';

module.exports = function sass(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-sass');

    // Options
    return {
        options: {
            sourceMap: true
        },
        dist: {
            sourceMap: false,
            files: {
                'dist/styles/main.css': 'public/styles/main.scss'
            }
        }
    };
};
