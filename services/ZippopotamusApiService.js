/* global -Promise */
'use strict';

var promisedGet = require('../lib/promisedGet');

module.exports = {

    getStateFromZipcode: function(zipcode) {
        var url = 'http://api.zippopotam.us/us/' + zipcode;
        var result = {
            code: null,
            name: null
        };

        return promisedGet(url)
        .then(function(response) {
            var place = response.places[0];
            result.code = place['state abbreviation'];
            result.name = place.state;
            return result;
        })
        .catch(function(err) {
            return result;
        });
    }

};
