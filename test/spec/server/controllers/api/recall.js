/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false*/

'use strict';

describe('/api/recall/:lat/:lon', function() {

    it('should return data when passed a lat and lon', function(done) {
        request(mock)
            .get('/api/recall/1/2')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(/"last_updated"/)
            .end(function(err, res) {
                done(err);
            });
    });

    it('should return 404 due to too many parameters in path', function(done) {
        request(mock)
            .get('/api/recall/1/2/3')
            .expect(404)
            .end(function(err, res) {
                done(err);
            });
    });

});
