'use strict';

module.exports = function htmlmin(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Options
    return {
        dist: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true
            },
            files: [{
                expand: true,
                cwd: 'dist',
                src: ['*.html', 'views/{,*/}*.html', 'partials/{,*/}*.html'],
                dest: 'dist'
            }]
        }
    };
};
