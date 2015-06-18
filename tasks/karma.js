'use strict';

module.exports = function karma(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-karma');

    // Options
    return {
        unit: {
            configFile: 'test/spec/client/karma.conf.js',
            singleRun: true
        }
    };
};
