/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false, nock:false*/

'use strict';

var promisedGet = require('../../../../lib/promisedGet');

describe('promisedGet', function() {

    it('should get a response that can be parsed as json', function(done) {

        nock('http://example.org')
        .get('/foo')
        .reply(200, {
            foo: 'bar'
        });

        promisedGet('http://example.org/foo')
        .then(function(result) {
            expect(result).to.have.property('foo');
            expect(result.foo).to.be('bar');
            done();
        });

    });

    it('should get a response and fail when response is not json', function(done) {

        nock('http://example.org')
        .get('/foo')
        .reply(200, '<html></html>');

        promisedGet('http://example.org/foo')
        .catch(function(err) {
            expect(err.message).to.be('Unexpected token <');
            done();
        });

    });

    it('should reject with 404', function(done) {

        nock('http://example.org')
        .get('/foo')
        .reply(404, {
            foo: 'bar'
        });

        promisedGet('http://example.org/foo')
        .catch(function(err) {
            expect(err.message).to.be('Server responded with status code 404 for url http://example.org/foo');
            done();
        });
    });

    it('should reject with connection error', function(done) {

        promisedGet('http://localhost:6')
        .catch(function(err) {
            expect(err.message).to.be('connect ECONNREFUSED');
            done();
        });
    });

});
