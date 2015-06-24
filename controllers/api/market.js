'use strict';

var UsdaMarketsApiService = require('../../services/UsdaMarketsApiService');

module.exports = function(router) {

    router.get('/:lat/:lon', function(req, res) {
        UsdaMarketsApiService.getMarketsByLatLong(req.params.lat, req.params.lon)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).json({msg: err});
        });
    });

    router.get('/:zipcode', function(req, res) {
        UsdaMarketsApiService.getMarketsByZipcode(req.params.zipcode)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).json({msg: err});
        });
    });

};
