'use strict';

module.exports = function env(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-env');

    return {
        options: {
        },
        prod: {
            NODE_ENV: 'prod'
        },
        sandbox: {
            NODE_ENV: 'sandbox',
            XUNIT_FILE: 'coverage/TESTS-all.xml'
        },
        test: {
            NODE_ENV: 'test',
            XUNIT_FILE: 'coverage/TESTS-all.xml'
        }
    };

};
