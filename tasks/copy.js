'use strict';

module.exports = function copy(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Options
    return {
        dist: {
            files: [{
                expand: true,
                dot: true,
                cwd: 'public',
                dest: 'dist',
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    '*.html',
                    'views/{,*/}*.html',
                    'partials/{,*/}*.html',
                    'images/{,*/}*.{webp}',
                    'fonts/{,*/}*.*',
                    'data/{,*/}*.*'
                ]
            }, {
                expand: true,
                cwd: '.tmp/images',
                dest: 'dist/images',
                src: ['generated/*']
            }]
        },
        styles: {
            expand: true,
            cwd: 'public/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
        }
    };
};
