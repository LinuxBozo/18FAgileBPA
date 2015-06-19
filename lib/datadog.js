'use strict';

var DD = require('node-dogstatsd').StatsD;

module.exports = function(options) {
    var datadog = new DD();
    var stat = 'node.express';
    var tags = options.tags || [];

    return function(req, res, next) {
        res.on('finish', function() {
            if (!req._startTime) {
                req._startTime = new Date();
            }

            tags.push('method:' + req.method.toLowerCase());

            if (options.protocol && req.protocol) {
                tags.push('protocol:' + req.protocol);
            }

            tags.push('path:' + req.path);

            tags.push('statusCode:' + res.statusCode);
            datadog.increment(stat + '.statusCode.' + res.statusCode, 1, tags);
            datadog.increment(stat + '.statusCode.all', 1, tags);

            datadog.histogram(stat + '.response_time', (new Date() - req._startTime), 1, tags);

        });
        next();
    };

};
