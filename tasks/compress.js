'use strict';

module.exports = function compress(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-compress');

    return {
        dist: {
            options: {
                archive: './dist/18f-agile-bpa.zip',
                mode: 'zip',  /* zip | gzip | deflate | tgz */
                pretty: true
            },
            files: [
                {
                    expand: true,
                    cwd: './',

                    //zip all files except coverage, test dirs and the grunt/test modules
                    src: ['**',
                        '!coverage/**',
                        '!test/**',
                        '!node_modules/**'
                    ]
                }
            ]
        },
        codedeploy: {
            options: {
                archive: './dist/18f-agile-bpa-codedeploy.zip',
                mode: 'zip',  /* zip | gzip | deflate | tgz */
                pretty: true
            },
            files: [
                {
                    expand: true,
                    dot: true,
                    cwd: './',

                    //zip dist directory
                    src: ['dist/18f-agile-bpa.zip', 'scripts/*', 'appspec.yml']
                }
            ]
        }
    };
};
