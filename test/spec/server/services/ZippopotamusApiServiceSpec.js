/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var ZippopotamusApiService = require('../../../../services/ZippopotamusApiService');

describe('Zippopotamus Api Service', function() {

    it('should return "State" block with valid info when proper zip is used', function(done) {

        nock('http://api.zippopotam.us')
        .get('/us/24153')
        .reply(200, require('../../../data/zippopotamus-24153.json'));

        ZippopotamusApiService.getStateFromZipcode('24153')
        .then(function(result) {
            expect(result).to.not.have.property('status');
            expect(result).to.have.property('code');
            expect(result.code).to.be('VA');
            done();
        });

    });

    it('should return "State" block with null info when zip does not exist or is invalid', function(done) {

        nock('http://api.zippopotam.us/')
        .get('/us/2415')
        .reply(404, {});

        ZippopotamusApiService.getStateFromZipcode('2415')
        .then(function(result) {
            expect(result).to.not.have.property('status');
            expect(result).to.have.property('code');
            expect(result.code).to.be(null);
            done();
        });
    });

});
