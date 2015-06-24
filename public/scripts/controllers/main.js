'use strict';

module.exports = /*@ngInject*/ function($scope, $http, geolocation, ngDialog) {

    var locationDialog;

    $scope.location = 'Trying to find you...';
    $scope.recallMetadata = null;
    $scope.recallResults = [];
    $scope.markets = [];
    $scope.zipcode = '';


    $scope.resetRecallData = function() {
        $scope.recallMetadata = null;
        $scope.recallResults = [];
    };

    $scope.getZipcodeData = function() {
        $http.get('/api/recall/' + $scope.zipcode).then(function(response) {
            $scope.location = response.data.meta.state;
            $scope.recallMetadata = response.data.meta;
            $scope.recallResults = response.data.results;
        });

        $http.get('/api/market/' + $scope.zipcode).then(function(response) {
            $scope.markets = response.data.results;
        });
    };

    $scope.getLocationData = function() {
        geolocation.getLocation().then(function(data) {
            $http.get('/api/recall/' + data.coords.latitude + '/' + data.coords.longitude).then(function(response) {
                $scope.location = response.data.meta.state;
                $scope.recallMetadata = response.data.meta;
                $scope.recallResults = response.data.results;
            });

            $http.get('/api/market/' + data.coords.latitude + '/' + data.coords.longitude).then(function(response) {
                $scope.markets = response.data.results;
            });
        });
    };

    $scope.openLocationDialog = function() {
        locationDialog = ngDialog.open({
            name: 'location',
            template: 'partials/location.html',
            controller: 'LocationCtrl',
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            scope: $scope
        });
        locationDialog.closePromise.then(function(data) {
            if (data.value === 'currentLocation') {
                $scope.resetRecallData();
                $scope.location = 'Trying to find you...';
                $scope.getLocationData();
            } else if (data.value !== '') {
                $scope.zipcode = data.value;
                $scope.resetRecallData();
                $scope.location = 'Getting data for ' + $scope.zipcode;
                $scope.getZipcodeData();
            }
        });
    };

    $scope.getLocationData();

};
