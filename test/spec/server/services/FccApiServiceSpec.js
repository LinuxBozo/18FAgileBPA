/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var FccApiService = require('../../../../services/FccApiService');

describe('FCC Api Service', function() {

    it('should return "State" block with valid info when proper lat/long is used', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=-80')
        .reply(200, require('../../../data/fcc-lat-lon-va.json'));

        FccApiService.getStateFromLatLong('37', '-80')
        .then(function(result) {
            expect(result).to.not.have.property('status');
            expect(result).to.have.property('code');
            expect(result.code).to.be('VA');
            done();
        });

    });

    it('should return "State" block with null info when lat/long does not exist', function(done) {

        nock('https://data.fcc.gov')
        .get('/api/block/find?format=json&latitude=37&longitude=80')
        .reply(200, require('../../../data/fcc-lat-lon-null.json'));

        FccApiService.getStateFromLatLong('37', '80')
        .then(function(result) {
            expect(result).to.not.have.property('status');
            expect(result).to.have.property('code');
            expect(result.code).to.be(null);
            done();
        });
    });

});
