'use strict';

var datadogOptions,
    options,
    app,
    express = require('express'),
    kraken = require('kraken-js'),
    datadog = require('./lib/datadog');

datadogOptions = {
    tags: ['app:devis18f']
};

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function(config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();
app.use(datadog(datadogOptions));
app.use(kraken(options));
app.on('start', function() {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
