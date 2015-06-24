/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet'),
    FccApiService = require('./FccApiService'),
    ZippopotamusService = require('./ZippopotamusApiService'),
    Promise = require('bluebird');

var getRecallsByStateDetails = function(stateDetails, limit, skip) {
    // Set some defaults
    limit = limit || 100;
    skip = skip || 0;

    var url = 'https://api.fda.gov/food/enforcement.json?limit=' + limit + '&skip=' + skip;
    url += '&search=status:"Ongoing"+AND+(distribution_pattern:"nationwide"+distribution_pattern:"' + stateDetails.code + '")';

    // get openFDA API key from the evironment and append if there is one
    if (process.env.OPENFDA_API_KEY) {
        url += '&api_key=' + process.env.OPENFDA_API_KEY;
    }

    return promisedGet(url)
    .then(function(response) {
        response.meta.state = stateDetails.name;
        return response;
    });
};

module.exports = {

    getRecallsByLatLong: function(lat, lon, limit, skip) {
        var rejection = 'Invalid Latitude or Longitude';

        return FccApiService.getStateFromLatLong(lat, lon)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    },

    getRecallsByZipcode: function(zipcode, limit, skip) {
        var rejection = 'Invalid Zipcode';

        return ZippopotamusService.getStateFromZipcode(zipcode)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    }

};
