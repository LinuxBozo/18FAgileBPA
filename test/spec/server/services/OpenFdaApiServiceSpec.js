/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var OpenFdaApiService = require('../../../../services/OpenFdaApiService'),
    latLonVA = require('../../../data/fcc-lat-lon-va.json'),
    zipVA = require('../../../data/zippopotamus-24153.json'),
    latLonNull = require('../../../data/fcc-lat-lon-null.json'),
    recallDataVA = require('../../../data/food-recalls-va.json'),
    recallDataVAThreeMonths = require('../../../data/food-recalls-va-3-months.json'),
    moment = require('moment');

describe('openFDA Api Service', function() {

    it('should return openFDA data when api key is not defined and proper lat/long is used', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByLatLong('37', '-80')
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta).to.have.property('state');
            expect(result.meta.state).to.be('Virginia');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should return openFDA data when api key is not defined and proper zip is used', function(done) {

        nock('http://api.zippopotam.us')
        .get('/us/24153')
        .reply(200, zipVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByZipcode('24153')
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta).to.have.property('state');
            expect(result.meta.state).to.be('Virginia');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should return empty result set when openFDA has no results that match query', function(done) {

        var now = moment(),
            endDate = now.format('YYYY-MM-DD'),
            startDate = now.subtract(1, 'months').format('YYYY-MM-DD');

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)%20AND%20recall_initiation_date%3A%5B' + startDate + '%20TO%20' + endDate + '%5D')
        .reply(404, {});

        OpenFdaApiService.getRecallsByLatLong('37', '-80', 3, null, null)
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.not.have.property('results');
            expect(result.meta).to.have.property('state');
            expect(result.meta.state).to.be('Virginia');
            expect(result).to.have.property('results');
            expect(result.results.length).to.be(0);
            done();
        });

    });

    it('should return openFDA data with proper age', function(done) {

        var now = moment(),
            endDate = now.format('YYYY-MM-DD'),
            startDate = now.subtract(3, 'months').format('YYYY-MM-DD');

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)%20AND%20recall_initiation_date%3A%5B' + startDate + '%20TO%20' + endDate + '%5D')
        .reply(200, recallDataVAThreeMonths);

        OpenFdaApiService.getRecallsByLatLong('37', '-80', 3, null, null)
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(22);
            done();
        });

    });

    it('should return openFDA data with proper limit', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=10&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByLatLong('37', '-80', null, 10, null)
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should return openFDA data with proper skip', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=10&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByLatLong('37', '-80', null, null, 10)
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should return openFDA data with proper limit and skip', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=20&skip=20&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByLatLong('37', '-80', null, 20, 20)
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should return openFDA data when api key and proper lat/long is used', function(done) {

        process.env.OPENFDA_API_KEY = 'MOCK_KEY';

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, latLonVA);

        nock('https://api.fda.gov')
        .get('/food/enforcement.json?limit=100&skip=0&search=status%3A%22Ongoing%22%20AND%20(distribution_pattern%3A%22nationwide%22%20distribution_pattern%3A%22VA%22)&api_key=MOCK_KEY')
        .reply(200, recallDataVA);

        OpenFdaApiService.getRecallsByLatLong('37', '-80')
        .then(function(result) {
            expect(result).to.have.property('meta');
            expect(result.meta).to.have.property('results');
            expect(result.meta.results).to.have.property('total');
            expect(result.meta.results.total).to.be(2758);
            done();
        });

    });

    it('should reject when we do not have a valid lat/lon due to null state code', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=80')
        .reply(200, latLonNull);

        OpenFdaApiService.getRecallsByLatLong('37', '80')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Latitude or Longitude');
            done();
        });
    });

    it('should reject when we do not have a valid lat/lon due to alpha lat/lon', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=foo&longitude=bar')
        .reply(404, {});

        OpenFdaApiService.getRecallsByLatLong('foo', 'bar')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Latitude or Longitude');
            done();
        });
    });

    it('should reject when we do not have a valid zipcode', function(done) {

        nock('http://api.zippopotam.us/')
        .get('/us/2415')
        .reply(404, {});

        OpenFdaApiService.getRecallsByZipcode('2415')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Zipcode');
            done();
        });
    });

});
