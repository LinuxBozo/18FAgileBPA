'use strict';

require('angular');
require('angular-mocks');

describe('Directive: scrollTo', function() {

    beforeEach(angular.mock.module('adsApp'));

    var element,
        scope,
        location;

    beforeEach(inject(function($rootScope, $compile, $location) {
        scope = $rootScope.$new();
        location = $location;
        element = angular.element('<a href="" scroll-to="example1">Example 1</a>');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    describe('on click', function() {
        it('should set the location hash to scroll to', function() {
            element.triggerHandler('click');
            var event = scope.$broadcast('$locationChangeStart');
            expect(event.defaultPrevented).toBeTruthy();
            expect(location.hash()).toBe('example1');
        });
    });
});
