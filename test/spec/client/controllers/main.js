'use strict';

require('angular');
require('angular-mocks');

var recallDataVA = require('../../../data/food-recalls-va.json');

describe('Controller: MainCtrl', function() {

    var controller,
        location,
        scope,
        httpBackend,
        geolocation,
        lat = 32, lon = -105,
        coords = {latitude: lat, longitude: lon};

    beforeEach(angular.mock.module('adsApp'));

    beforeEach(inject(function($rootScope, $q, $controller, $httpBackend, _geolocation_) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        geolocation = _geolocation_;

        var deferred = $q.defer();
        deferred.resolve({coords: coords}); //  always resolved, you can do it from your spec
        spyOn(geolocation, 'getLocation').and.returnValue(deferred.promise);

        controller('MainCtrl', {
            $scope: scope
        });
    }));

    describe('initial state', function() {
        it('should set the current location to a helpful message', function() {
            expect(scope.location).toBe('Trying to find you...');
        });

        it('should default the recall metadata to null', function() {
            expect(scope.recallMetadata).toBe(null);
        });

        it('should default the recall results to an empty list', function() {
            expect(scope.recallResults).toEqual([]);
        });
    });

    describe('when browser returns geolocation', function() {
        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon).respond(recallDataVA);
            httpBackend.flush();
        });

        it('should set the current location to Virginia', function() {
            expect(scope.location).toBe('Virginia');
        });

        it('should populate recallMetadata', function() {
            expect(scope.recallMetadata.last_updated).toBe('2015-05-31');
        });

        it('should popupate recallResults', function() {
            expect(scope.recallResults.length).toBe(100);
        });
    });
});
