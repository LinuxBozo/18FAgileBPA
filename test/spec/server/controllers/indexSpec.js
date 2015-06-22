/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false*/

'use strict';

describe('/', function() {

    it('should return our main index.html with angular app', function(done) {
        request(mock)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/ng-app="adsApp"/)
            .end(function(err, res) {
                done(err);
            });
    });

});
