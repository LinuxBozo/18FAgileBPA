/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var latLonVA = require('../../../../data/fcc-lat-lon-va.json'),
    zipVA = require('../../../../data/zippopotamus-24153.json'),
    latLonNull = require('../../../../data/fcc-lat-lon-null.json'),
    recallDataVA = require('../../../../data/food-recalls-va.json'),
    recallDataVAThreeMonths = require('../../../../data/food-recalls-va-3-months.json'),
    recallDataVAHummus = require('../../../../data/food-recalls-va-hummus.json'),
    moment = require('moment');

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

    it('should return data when passed a valid lat and lon and age', function(done) {

        var now = moment(),
            endDate = now.format('YYYY-MM-DD'),
            startDate = now.subtract(3, 'months').format('YYYY-MM-DD');

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)%20AND%20recall_initiation_date%3A%5B' + startDate + '%20TO%20' + endDate + '%5D')
        .reply(200, recallDataVAThreeMonths);

        request(mock)
            .get('/api/recall/37/-80?age=3')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                var text = JSON.parse(res.text);
                expect(text).to.have.property('meta');
                expect(text.meta).to.have.property('results');
                expect(text.meta.results).to.have.property('total');
                expect(text.meta.results.total).to.be(22);
                done(err);
            });

    });

    it('should return data when passed a valid lat and long and keywords', function(done) {
        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)%20AND%20(reason_for_recall%3A%22hummus%22%20product_description%3A%22hummus%22)')
        .reply(200, recallDataVAHummus);

        request(mock)
            .get('/api/recall/37/-80?keywords=hummus')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                var text = JSON.parse(res.text);
                expect(text).to.have.property('meta');
                expect(text.meta).to.have.property('results');
                expect(text.meta.results).to.have.property('total');
                expect(text.meta.results.total).to.be(24);
                done(err);
            });

    });

    it('should return empty results when openFDA has no results', function(done) {
        var now = moment(),
            endDate = now.format('YYYY-MM-DD'),
            startDate = now.subtract(1, 'months').format('YYYY-MM-DD');

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)%20AND%20recall_initiation_date%3A%5B' + startDate + '%20TO%20' + endDate + '%5D')
        .reply(404, {});

        request(mock)
            .get('/api/recall/37/-80?age=1')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                var text = JSON.parse(res.text);
                expect(text).to.have.property('meta');
                expect(text.meta).to.not.have.property('last_updated');
                expect(text).to.have.property('results');
                expect(text.results.length).to.be(0);
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
