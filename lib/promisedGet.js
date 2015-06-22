'use strict';

var superagent = require('superagent'),
    Promise = require('bluebird'),
    _ = require('lodash');

module.exports = function(url) {
    var deferred = Promise.defer();

    superagent
    .get(url)
    .end(function(err, res) {
        if (res && res.statusCode >= 300) {
            return deferred.reject(new Error('Server responded with status code ' + res.statusCode + ' for url ' + url));
        }

        if (err) {
            return deferred.reject(err);
        }
        try {
            return deferred.resolve(JSON.parse(res.text));
        } catch (ex) {
            return deferred.reject(ex);
        }
    });

    return deferred.promise;
};
