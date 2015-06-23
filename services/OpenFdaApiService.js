/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet'),
    FccApiService = require('./FccApiService'),
    Promise = require('bluebird');

module.exports = {

    getRecallsByLatLong: function(lat, lon, limit, skip) {
        return FccApiService.getStateFromLatLong(lat, lon)
        .then(function(result) {
            if (result.code) {
                return this.getRecallsByStateAbbreviation(result.code, limit, skip);
            } else {
                return Promise.reject('Invalid Latitude or Longitude');
            }
        }.bind(this));
    },

    getRecallsByStateAbbreviation: function(state, limit, skip) {

        // Set some defaults
        limit = limit || 100;
        skip = skip || 0;

        var url = 'https://api.fda.gov/food/enforcement.json?limit=' + limit + '&skip=' + skip;
        url += '&search=status:"Ongoing"+AND+(distribution_pattern:"nationwide"+distribution_pattern:"' + state + '")';

        // get openFDA API key from the evironment and append if there is one
        if (process.env.OPENFDA_API_KEY) {
            url += '&api_key=' + process.env.OPENFDA_API_KEY;
        }

        return promisedGet(url);
    }

};
