'use strict';

module.exports = function (grunt) {

    grunt.angularConfig = {
        app: 'public',
        dist: 'dist',
        modules: 'node_modules'
    };

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });

    // handle coverage event by sending data to coveralls
    grunt.event.on('coverage', function(lcov, done) {
        require('coveralls').handleInput(lcov, function(err) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    /*
     * Register group tasks
     */

    //npm install
    grunt.registerTask('npm_install', 'install dependencies', function() {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('npm install', {cwd: './'}, function(err, stdout) {
            console.log(stdout);
            cb();
        });
    });

    grunt.registerTask('open_coverage_server', 'open coverage report in default browser', function() {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('open coverage/lcov-report/index.html', {cwd: './'}, function(err, stdout) {
            console.log(stdout);
            cb();
        });
    });
    grunt.registerTask('open_coverage_client', 'open coverage report in default browser', function() {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('open coverage/html-report/index.html', {cwd: './'}, function(err, stdout) {
            console.log(stdout);
            cb();
        });
    });

    // Register group tasks
    grunt.registerTask('clean_all', ['clean:node_modules', 'clean:coverage', 'clean:docs', 'npm_install']);
    grunt.registerTask('test', ['env:test', 'clean:coverage', 'jscs:all', 'jshint', 'mocha_istanbul']);
    grunt.registerTask('coverage', ['test', 'open_coverage_server', 'open_coverage_client']);
    grunt.registerTask('serve', ['env:sandbox', 'jshint', 'browserify:dev', 'develop', 'watch']);
    grunt.registerTask('test', ['env:test', 'clean:coverage', 'jscs:all', 'jshint', 'mocha_istanbul', 'karma']);

};
