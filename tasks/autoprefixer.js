'use strict';

module.exports = function autoprefixer(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-autoprefixer');

    // Options
    return {
        options: {
            browsers: ['last 1 version']
        },
        dist: {
            files: [{
                expand: true,
                cwd: '.tmp/styles/',
                src: '{,*/}*.css',
                dest: '.tmp/styles/'
            }]
        }
    };
};
