'use strict';

module.exports = function(router) {

    router.get('/:lat/:lon', function(req, res) {
        res.json({meta: { last_updated: '2015-05-31'}});
    });

};
