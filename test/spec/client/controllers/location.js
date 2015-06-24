'use strict';

require('angular');
require('angular-mocks');

describe('Controller: LocationCtrl', function() {

    var scope,
        controller;

    beforeEach(angular.mock.module('adsApp'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller;

        scope.closeThisDialog = function(val) { return val; };
        spyOn(scope, 'closeThisDialog');

        controller('LocationCtrl', {
            $scope: scope
        });
    }));

    describe('initial scope', function() {
        it('should set zipcode to blank string', function() {
            expect(scope.zipcode).toBe('');
        });
    });

    describe('setZip()', function() {
        it('should close the dialog', function() {
            scope.setZip();
            expect(scope.closeThisDialog).toHaveBeenCalled();
        });
    });

    describe('findLocation()', function() {
        it('should close the dialog', function() {
            scope.findLocation();
            expect(scope.closeThisDialog).toHaveBeenCalled();
        });
    });

});
