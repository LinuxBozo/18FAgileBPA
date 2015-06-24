/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var latLonVA = require('../../../../data/fcc-lat-lon-va.json');
var zipVA = require('../../../../data/zippopotamus-24153.json');
var latLonNull = require('../../../../data/fcc-lat-lon-null.json');
var recallDataVA = require('../../../../data/food-recalls-va.json');

describe('/api/recall/:zipcode', function() {

    beforeEach(function() {
        nock.cleanAll();
    });

    it('should return data when passed a valid zip', function(done) {

        nock('http://api.zippopotam.us')
        .get('/us/24153')
        .reply(200, zipVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        request(mock)
            .get('/api/recall/24153')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 500 when passed an invalid zipcode', function(done) {
        nock('http://api.zippopotam.us/')
        .get('/us/2415')
        .reply(404, {});

        request(mock)
            .get('/api/recall/2415')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(/"msg"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too little parameters in path', function(done) {
        request(mock)
            .get('/api/recall')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

});

describe('/api/recall/:lat/:lon', function() {

    beforeEach(function() {
        nock.cleanAll();
    });

    it('should return data when passed a valid lat and lon', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        request(mock)
            .get('/api/recall/37/-80')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return data when passed a valid lat and lon and limit', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=10&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        request(mock)
            .get('/api/recall/37/-80?limit=10')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return data when passed a valid lat and lon and skip', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=10&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        request(mock)
            .get('/api/recall/37/-80?skip=10')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return data when passed a valid lat and lon, limit and skip', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=20&skip=20&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        request(mock)
            .get('/api/recall/37/-80?limit=20&skip=20')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 500 when passed an invalid lat and lon using numbers', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=80')
        .reply(200, latLonNull);

        request(mock)
            .get('/api/recall/37/80')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(/"msg"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 500 when passed an invalid lat and lon using alpha', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=foo&longitude=bar')
        .reply(404, {});

        request(mock)
            .get('/api/recall/foo/bar')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect(/"msg"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too many parameters in path', function(done) {
        request(mock)
            .get('/api/recall/37/-80/0')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

});
