'use strict';

var OpenFdaApiService = require('../../services/OpenFdaApiService');

module.exports = function(router) {

    router.get('/:lat/:lon', function(req, res) {
        OpenFdaApiService.getRecallsByLatLong(req.params.lat, req.params.lon, req.query.limit, req.query.skip)
        .then(function(result) {
            res.json(result);
        })
        .catch(function(err) {
            res.status(500).json({msg: err});
        });
    });

};
