/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false*/

'use strict';

describe('/api', function() {

    it('should say "hello"', function(done) {
        request(mock)
            .get('/api')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect(/"name": "index"/)
            .end(function(err, res) {
                done(err);
            });
    });

});
