'use strict';

module.exports = function mochaIstanbul(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    return {
        coverage: {
            src: 'test/spec/server', /* the folder name for the tests */
            options: {
                recursive: true,
                coverage: true, /* emit the coverage event */
                /* quiet: true, */
                excludes: [],
                mochaOptions: [
                    '--reporter', 'spec-xunit-file'
                ]
            }
        }
    };

};
