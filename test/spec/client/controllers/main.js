'use strict';

require('angular');
require('angular-mocks');

var recallDataVA = require('../../../data/food-recalls-va.json'),
    marketsVa = require('../../../data/markets-va.json');

describe('Controller: MainCtrl', function() {

    var controller,
        location,
        scope,
        httpBackend,
        geolocation,
        mockNgDialog,
        lat = 32, lon = -105,
        zipcode = 24153,
        coords = {latitude: lat, longitude: lon};

    beforeEach(angular.mock.module('adsApp'));

    beforeEach(inject(function($rootScope, $q, $controller, $httpBackend, _geolocation_) {
        scope = $rootScope.$new();
        controller = $controller;
        httpBackend = $httpBackend;
        geolocation = _geolocation_;

        var deferred = $q.defer();
        deferred.resolve({coords: coords});
        spyOn(geolocation, 'getLocation').and.returnValue(deferred.promise);

        var mockNgDialogPromise = {
            closePromise: {
                then: function(callback) {
                    callback({value:'24153'});
                }
            }
        };
        mockNgDialog = {
            open: function() {},
            close: function() {}
        };
        spyOn(mockNgDialog, 'open').and.returnValue(mockNgDialogPromise);

        controller('MainCtrl', {
            $scope: scope,
            geolocation: geolocation,
            ngDialog: mockNgDialog
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

        it('should default the market results to an empty list', function() {
            expect(scope.markets).toEqual([]);
        });

        it('should not open the location dialog', function() {
            expect(mockNgDialog.open).not.toHaveBeenCalled();
        });

    });

    describe('when browser returns geolocation', function() {
        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon).respond(recallDataVA);
            httpBackend.whenGET('/api/market/' + lat + '/' + lon).respond(marketsVa);
            httpBackend.flush();
        });

        it('should set the current location to Virginia', function() {
            expect(scope.location).toBe('Virginia');
        });

        it('should populate recallMetadata', function() {
            expect(scope.recallMetadata.last_updated).toBe('2015-05-31');
        });

        it('should populate recallResults', function() {
            expect(scope.recallResults.length).toBe(100);
        });

        it('should populate markets', function() {
            expect(scope.markets.length).toBe(19);
        });

        it('should clear recall data when asked', function() {
            scope.resetRecallData();
            expect(scope.recallMetadata).toBe(null);
            expect(scope.recallResults).toEqual([]);
        });
    });

    describe('when zipcode is set, and recall API is requested', function() {

        beforeEach(function() {
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon).respond(recallDataVA);
            httpBackend.whenGET('/api/market/' + lat + '/' + lon).respond(marketsVa);
            httpBackend.flush();
        });

        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            scope.resetRecallData();
            expect(scope.zipcode).toBe('');
            expect(scope.recallMetadata).toBe(null);
            expect(scope.recallResults).toEqual([]);
            scope.zipcode = zipcode;
            scope.getZipcodeData();
            httpBackend.whenGET('/api/recall/' + zipcode).respond(recallDataVA);
            httpBackend.whenGET('/api/market/' + zipcode).respond(marketsVa);
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

        it('should populate markets', function() {
            expect(scope.markets.length).toBe(19);
        });

    });

    describe('openLocationDialog()', function() {

        it('should open location dialog', function() {
            scope.openLocationDialog();
            expect(mockNgDialog.open).toHaveBeenCalled();
        });

    });

});
