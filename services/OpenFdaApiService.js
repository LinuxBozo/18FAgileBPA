/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet'),
    FccApiService = require('./FccApiService'),
    ZippopotamusService = require('./ZippopotamusApiService'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment');

var getAPIURL = function(stateDetails, keywords, age, limit, skip) {
    // Set some defaults
    limit = limit || 100;
    skip = skip || 0;

    var url = 'https://api.fda.gov/food/enforcement.json?limit=' + limit + '&skip=' + skip;
    url += '&search=status:"Ongoing"+AND+(distribution_pattern:"nationwide"+distribution_pattern:"' + stateDetails.code + '")';
    url = processAge(url, age);
    url = processKeywords(url, keywords);
    url = processApiKey(url);
    return url;
};

var processApiKey = function(url) {
    // get openFDA API key from the evironment and append if there is one
    if (process.env.OPENFDA_API_KEY) {
        url += '&api_key=' + process.env.OPENFDA_API_KEY;
    }
    return url;
};

var processAge = function(url, age) {
    var now,
        endDate,
        startDate;

    // If age is a valid integer
    if (age && _.isFinite(_.parseInt(age))) {
        now = moment();
        endDate = now.format('YYYY-MM-DD');
        startDate = now.subtract(_.parseInt(age), 'months').format('YYYY-MM-DD');
        url += '+AND+recall_initiation_date:[' + startDate + '+TO+' + endDate + ']';
    }
    return url;
};

var processKeywords = function(url, keywords) {
    if (keywords) {
        keywords = encodeURIComponent(keywords);
        url += '+AND+(reason_for_recall:"' + keywords + '"+product_description:"' + keywords + '")';
    }
    return url;
};

var getRecallsByStateDetails = function(stateDetails, keywords, age, limit, skip) {
    var url = getAPIURL(stateDetails, keywords, age, limit, skip);

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

    getRecallsByLatLong: function(coords, keywords, age, limit, skip) {
        var rejection = 'Invalid Latitude or Longitude';

        return FccApiService.getStateFromLatLong(coords.lat, coords.lon)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, keywords, age, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    },

    getRecallsByZipcode: function(zipcode, keywords, age, limit, skip) {
        var rejection = 'Invalid Zipcode';

        return ZippopotamusService.getStateFromZipcode(zipcode)
        .then(function(result) {
            if (result.code) {
                return getRecallsByStateDetails(result, keywords, age, limit, skip);
            } else {
                return Promise.reject(rejection);
            }
        })
        .catch(function(err) {
            return Promise.reject(rejection);
        });
    }

};
