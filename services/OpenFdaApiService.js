/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet'),
    FccApiService = require('./FccApiService'),
    ZippopotamusService = require('./ZippopotamusApiService'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

var getRecallsByStateDetails = function(stateDetails, age, limit, skip) {
    var now,
        endDate,
        startDate;

    // Set some defaults
    age = age || 0;
    limit = limit || 100;
    skip = skip || 0;

    var url = 'https://api.fda.gov/food/enforcement.json?limit=' + limit + '&skip=' + skip;
    url += '&search=status:"Ongoing"+AND+(distribution_pattern:"nationwide"+distribution_pattern:"' + stateDetails.code + '")';
    if (age && _.isFinite(_.parseInt(age))) {
        now = moment();
        endDate = now.format('YYYY-MM-DD');
        startDate = now.subtract(_.parseInt(age), 'months').format('YYYY-MM-DD');
        url += '+AND+recall_initiation_date:[' + startDate + '+TO+' + endDate + ']';
    }

    // get openFDA API key from the evironment and append if there is one
    if (process.env.OPENFDA_API_KEY) {
        url += '&api_key=' + process.env.OPENFDA_API_KEY;
    }

    return promisedGet(url)
    .then(function(response) {
        response.meta.state = stateDetails.name;
        return response;
    }).catch(function(err) {
        return {
            meta: {
                state: stateDetails.name
            },
            results: []
        };
    });
};

module.exports = {

    getRecallsByLatLong: function(lat, lon, age, limit, skip) {
        var rejection = 'Invalid Latitude or Longitude';

        return FccApiService.getStateFromLatLong(lat, lon)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, age, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    },

    getRecallsByZipcode: function(zipcode, age, limit, skip) {
        var rejection = 'Invalid Zipcode';

        return ZippopotamusService.getStateFromZipcode(zipcode)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, age, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    }

};
