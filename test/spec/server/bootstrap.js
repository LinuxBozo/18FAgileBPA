/*global describe:false, it:false, beforeEach:false, afterEach:false, request:false, mock:false*/

'use strict';

global.expect = require('must');
global.request = require('supertest');
global.nock = require('nock');

process.setMaxListeners(0);

var kraken = require('kraken-js'),
    express = require('express');

beforeEach(function(done) {
    var app = express();
    app.on('start', done);
    app.use(kraken({
        basedir: process.cwd()
    }));

    global.mock = app.listen(1337);

});

afterEach(function(done) {
    mock.close(done);
});

