/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet');

module.exports = {

    getStateFromLatLong: function(lat, lon) {
        var url = 'https://data.fcc.gov/api/block/find?format=json&latitude=' + lat + '&longitude=' + lon;
        return promisedGet(url)
        .then(function(result) {
            return result.State;
        });
    }

};
