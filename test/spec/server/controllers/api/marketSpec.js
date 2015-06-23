/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var marketsDataVA = require('../../../../data/markets-va.json'),
    marketsDataEmpty = require('../../../../data/markets-no-matches.json'),
    marketsDataError = require('../../../../data/markets-error.json');

describe('/api/market/:lat/:lon', function() {

    beforeEach(function() {
        nock.cleanAll();
    });

    it('should return data when passed a valid lat and lon', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=37.2869&lng=-80.0558')
        .reply(200, marketsDataVA);

        request(mock)
            .get('/api/market/37.2869/-80.0558')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"distance"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return empty result when passed an invalid lat and lon using numbers', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=37.2869&lng=80.0558')
        .reply(200, marketsDataEmpty);

        request(mock)
            .get('/api/market/37.2869/80.0558')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                expect(JSON.parse(res.text).results.length).to.be(0);
                done(err);
            });
    });

    it('should return 500 when passed an invalid lat and lon using alpha', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=foo&lng=bar')
        .reply(200, marketsDataError);

        request(mock)
            .get('/api/market/foo/bar')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(/"msg"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too many parameters in path', function(done) {
        request(mock)
            .get('/api/market/37.2869/-80.0558/0')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too little parameters in path', function(done) {
        request(mock)
            .get('/api/market/37.2869')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

});
