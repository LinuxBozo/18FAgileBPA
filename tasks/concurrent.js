'use strict';

module.exports = function concurrent(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-concurrent');

    // Options
    return {
        local: [
            'copy:styles'
        ],
        test: [
            'copy:styles'
        ],
        dist: [
            'copy:styles',
            'imagemin',
            'svgmin'
        ]
    };
};
