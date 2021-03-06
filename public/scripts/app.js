'use strict';

require('angular');
require('angular-aria');
require('angular-cookies');
require('angular-resource');
require('angular-route');
require('angular-sanitize');
require('angularjs-geolocation/dist/angularjs-geolocation.min.js');
require('ng-dialog');

var Promise = require('bluebird');

angular
    .module('adsApp', [
        'ngAria',
        'ngCookies',
        'ngDialog',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'geolocation'
    ])
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(function($rootScope) {
        // Make bluebird promises behave like $q promises
        // http://stackoverflow.com/questions/23984471/how-do-i-use-bluebird-with-angular
        Promise.setScheduler(function(cb) {
            $rootScope.$evalAsync(cb);
        });
    });

require('./controllers');
require('./directives');
