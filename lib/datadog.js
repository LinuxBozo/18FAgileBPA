'use strict';

var DD = require('node-dogstatsd').StatsD;
var util = require('util');

module.exports = function(options) {
    var datadog = new DD();
    var stat = 'node.express';
    var tags = options.tags || [];

    return function(req, res, next) {
        if (!req._startTime) {
            req._startTime = new Date();
        }

        res.on('finish', function() {

            var dogTags = [].concat(tags);

            if (req.protocol) {
                dogTags.push('protocol:' + req.protocol);
            }
            dogTags.push('method:' + req.method.toLowerCase());
            dogTags.push('path:' + req.path);
            dogTags.push('statusCode:' + res.statusCode);
            dogTags.push('browser:' + req.headers['user-agent']);

            datadog.increment(stat + '.response.code.' + res.statusCode, 1, dogTags);
            datadog.increment(stat + '.response.code.all', 1, dogTags);
            datadog.histogram(stat + '.response.time', (new Date() - req._startTime), 1, dogTags);

        });

        next();
    };

};
