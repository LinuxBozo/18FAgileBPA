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
        mockNgDialogPromise,
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

        mockNgDialog = {
            open: function() {},
            close: function() {}
        };

        controller('MainCtrl', {
            $scope: scope,
            geolocation: geolocation
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

        it('should default the keyword search to an empty string', function() {
            expect(scope.recallFilters.keywords).toBe('');
        });

        it('should default the date filter to "6 months"', function() {
            expect(scope.recallFilters.age).toBe('3');
        });
    });

    describe('when browser returns valid geolocation', function() {
        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon + '?age=3&keywords=').respond(recallDataVA);
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

    describe('when browser returns invalid geolocation', function() {
        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon + '?age=3&keywords=').respond(500, '');
            httpBackend.whenGET('/api/market/' + lat + '/' + lon).respond(500, '');
            httpBackend.flush();
        });

        it('should set location to error message', function() {
            expect(scope.location).toBe('No data for your location..');
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

    });

    describe('when valid zipcode is set', function() {

        beforeEach(function() {
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon + '?age=3&keywords=').respond(recallDataVA);
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
            httpBackend.whenGET('/api/recall/' + zipcode + '?age=3&keywords=').respond(recallDataVA);
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

    describe('when invalid zipcode is set', function() {
        beforeEach(function() {
            recallDataVA.meta.state = 'Virginia';
            httpBackend.whenGET('/api/recall/' + lat + '/' + lon + '?age=3&keywords=').respond(recallDataVA);
            httpBackend.whenGET('/api/market/' + lat + '/' + lon).respond(marketsVa);
            httpBackend.flush();
        });

        beforeEach(function() {
            scope.zipcode = 'foo';
            scope.getZipcodeData();
            httpBackend.whenGET('/api/recall/' + scope.zipcode + '?age=3&keywords=').respond(500, '');
            httpBackend.whenGET('/api/market/' + scope.zipcode).respond(500, '');
            httpBackend.flush();
        });

        it('should set location to error message', function() {
            expect(scope.location).toBe('No data for your ZIP: foo');
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
    });

    describe('openLocationDialog(), promise returns zipcode', function() {

        beforeEach(function() {
            mockNgDialogPromise = {
                closePromise: {
                    then: function(callback) {
                        callback({value:zipcode});
                    }
                }
            };

            spyOn(mockNgDialog, 'open').and.returnValue(mockNgDialogPromise);

            controller('MainCtrl', {
                $scope: scope,
                geolocation: geolocation,
                ngDialog: mockNgDialog
            });
        });

        it('should open location dialog, set proper location with promise', function() {
            scope.location = 'Foobar';
            scope.openLocationDialog();
            expect(mockNgDialog.open).toHaveBeenCalled();
            expect(scope.location).toBe('Getting data for ' + zipcode);
        });

    });

    describe('openLocationDialog(), promise returns currentLocation', function() {

        beforeEach(function() {
            mockNgDialogPromise = {
                closePromise: {
                    then: function(callback) {
                        callback({value:'currentLocation'});
                    }
                }
            };

            spyOn(mockNgDialog, 'open').and.returnValue(mockNgDialogPromise);

            controller('MainCtrl', {
                $scope: scope,
                geolocation: geolocation,
                ngDialog: mockNgDialog
            });
        });

        it('should open location dialog, set proper location with promise', function() {
            scope.location = 'Foobar';
            scope.openLocationDialog();
            expect(mockNgDialog.open).toHaveBeenCalled();
            expect(scope.location).toBe('Trying to find you...');
        });

    });

    describe('openLocationDialog(), promise returns close button click', function() {

        beforeEach(function() {
            mockNgDialogPromise = {
                closePromise: {
                    then: function(callback) {
                        callback({value:'$closeButton'});
                    }
                }
            };

            spyOn(mockNgDialog, 'open').and.returnValue(mockNgDialogPromise);

            controller('MainCtrl', {
                $scope: scope,
                geolocation: geolocation,
                ngDialog: mockNgDialog
            });
        });

        it('should open location dialog, keep location with promise', function() {
            scope.location = 'Foobar';
            scope.openLocationDialog();
            expect(mockNgDialog.open).toHaveBeenCalled();
            expect(scope.location).toBe('Foobar');
        });
    });

    describe('when user clicks apply filters', function() {
        describe('if location is determined by zipcode', function() {
            beforeEach(function() {
                scope.zipcode = zipcode;
                spyOn(scope, 'getZipcodeData');
                scope.applyFilters();
            });

            it('should send filters through the zip code API', function() {
                expect(scope.getZipcodeData).toHaveBeenCalled();
            });
        });
        describe('if location is determined by geolocation', function() {
            beforeEach(function() {
                scope.coords = coords;
                spyOn(scope, 'getLocationData');
                scope.applyFilters();
            });

            it('should send filters through the location API', function() {
                expect(scope.getLocationData).toHaveBeenCalled();
            });
        });
    });
});
