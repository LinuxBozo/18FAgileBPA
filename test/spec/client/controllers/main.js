'use strict';

require('angular');
require('angular-mocks');

describe('Controller: MainCtrl', function() {

    var controller,
        location,
        scope;

    beforeEach(angular.mock.module('adsApp'));

    beforeEach(inject(function ($rootScope, $location, $controller) {
        scope = $rootScope.$new();
        controller = $controller;
        location = $location;

        controller('MainCtrl', {
            $scope: scope,
            $location: location
        });
    }));

    describe('initial state', function() {
        it('should have a list of things', function() {
            expect(scope.things.length).toBe(2);
        });
    });
});
