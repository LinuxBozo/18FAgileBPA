'use strict';

var OpenFdaApiService = require('../../services/OpenFdaApiService');

module.exports = function(router) {

    router.get('/:lat/:lon', function(req, res) {
        OpenFdaApiService.getRecallsByLatLong({lat: req.params.lat, lon: req.params.lon}, req.query.keywords, req.query.age, req.query.limit, req.query.skip)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).json({msg: err});
        });
    });

    router.get('/:zipcode', function(req, res) {
        OpenFdaApiService.getRecallsByZipcode(req.params.zipcode, req.query.keywords, req.query.age, req.query.limit, req.query.skip)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).json({msg: err});
        });
    });

};
