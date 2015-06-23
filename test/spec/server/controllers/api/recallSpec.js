/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

describe('/api/recall/:lat/:lon', function() {

    it('should return data when passed a valid lat and lon', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, require('../../../../data/fcc-lat-lon-va.json'));

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, require('../../../../data/food-recalls-va.json'));

        request(mock)
            .get('/api/recall/37/-80')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 500 when passed an invalid lat and lon', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=80')
        .reply(200, require('../../../../data/fcc-lat-lon-null.json'));

        request(mock)
            .get('/api/recall/37/80')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(/"msg"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too many parameters in path', function(done) {
        request(mock)
            .get('/api/recall/1/2/3')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

});
