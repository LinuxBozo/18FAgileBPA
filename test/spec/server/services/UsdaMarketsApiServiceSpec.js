/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var UsdaMarketsApiService = require('../../../../services/UsdaMarketsApiService'),
    marketsDataVA = require('../../../data/markets-va.json'),
    marketsDataEmpty = require('../../../data/markets-no-matches.json'),
    marketsDataError = require('../../../data/markets-error.json');

describe('USDA Farmers Markets Api Service', function() {

    it('should return data in correct format when proper lat/long is used', function(done) {

        expect(marketsDataVA.results[0]).to.not.have.property('distance');

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=37.2869&lng=-80.0558')
        .reply(200, marketsDataVA);

        UsdaMarketsApiService.getMarketsByLatLong('37.2869', '-80.0558')
        .then(function(result) {
            expect(result).to.have.property('results');
            expect(result.results.length).to.be(19);
            expect(result.results[0]).to.have.property('distance');
            expect(result.results[0].distance).to.be('0.4');
            done();
        });

    });

    it('should return data in correct format when proper zip is used', function(done) {

        expect(marketsDataVA.results[0]).to.not.have.property('distance');

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/zipSearch?zip=24153')
        .reply(200, marketsDataVA);

        UsdaMarketsApiService.getMarketsByZipcode('24153')
        .then(function(result) {
            expect(result).to.have.property('results');
            expect(result.results.length).to.be(19);
            expect(result.results[0]).to.have.property('distance');
            expect(result.results[0].distance).to.be('0.4');
            done();
        });

    });

    it('should return empty result set when invalid lat/long is used', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=37.2869&lng=80.0558')
        .reply(200, marketsDataEmpty);

        UsdaMarketsApiService.getMarketsByLatLong('37.2869', '80.0558')
        .then(function(result) {
            expect(result).to.have.property('results');
            expect(result.results.length).to.be(0);
            done();
        });

    });

    it('should reject when we do not have a valid lat/lon due to alpha lat/lon', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=foo&lng=bar')
        .reply(200, marketsDataError);

        UsdaMarketsApiService.getMarketsByLatLong('foo', 'bar')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Latitude or Longitude');
            done();
        });
    });

    it('should reject when we do not have service has an error', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/locSearch?lat=37.2869&lng=-80.0558')
        .reply(404, {});

        UsdaMarketsApiService.getMarketsByLatLong('37.2869', '-80.0558')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Latitude or Longitude');
            done();
        });
    });

    it('should reject when we do not have a valid zipcode', function(done) {

        nock('http://search.ams.usda.gov/')
        .get('/farmersmarkets/v1/data.svc/zipSearch?zip=2415')
        .reply(200, marketsDataError);

        UsdaMarketsApiService.getMarketsByZipcode('2415')
        .catch(function(err) {
            expect(err).to.not.be(null);
            expect(err).to.be('Invalid Zipcode');
            done();
        });
    });

});
