'use strict';

module.exports = function imagemin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Options
    return {
        dist: {
            files: [{
                expand: true,
                cwd: 'public/images',
                src: '{,*/}*.{png,jpg,jpeg,gif}',
                dest: 'dist/images'
            }]
        }
    };
};
