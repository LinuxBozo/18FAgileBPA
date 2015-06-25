'use strict';

module.exports = /*@ngInject*/ function($scope, $http, geolocation, ngDialog) {

    var locationDialog;

    // Initialize $scope
    $scope.location = 'Trying to find you...';
    $scope.recallMetadata = null;
    $scope.recallResults = [];
    $scope.markets = [];
    $scope.coords = {};
    $scope.zipcode = '';
    $scope.recallSearch = '';
    $scope.recallAgeOptions = [
        {value:'1',  text:'1 month'},
        {value:'3',  text:'3 months'},
        {value:'6',  text:'6 months'},
        {value:'12', text:'12 months'},
        {value:'',   text:'All'}
    ];
    $scope.recallAge = $scope.recallAgeOptions[2]; // 6 months

    // Reset the recall data
    $scope.resetRecallData = function() {
        $scope.recallMetadata = null;
        $scope.recallResults = [];
    };

    // Get recall and farmers market data for a given zip code
    $scope.getZipcodeData = function() {
        $http.get('/api/recall/' + $scope.zipcode).then(function(response) {
            $scope.location = response.data.meta.state;
            $scope.recallMetadata = response.data.meta;
            $scope.recallResults = response.data.results;
        })
        .catch(function(data) {
            $scope.location = 'No data for your ZIP: ' + $scope.zipcode;
            $scope.resetRecallData();
        });

        $http.get('/api/market/' + $scope.zipcode).then(function(response) {
            $scope.markets = response.data.results;
        }).catch(function(data) {
            $scope.location = 'No data for your ZIP: ' + $scope.zipcode;
            $scope.markets = [];
        });
    };

    // Get recall and farmers market data by geolocation
    $scope.getLocationData = function() {
        geolocation.getLocation().then(function(data) {
            $scope.coords = data.coords;
            $http.get('/api/recall/' + $scope.coords.latitude + '/' + $scope.coords.longitude).then(function(response) {
                $scope.location = response.data.meta.state;
                $scope.recallMetadata = response.data.meta;
                $scope.recallResults = response.data.results;
            }).catch(function(data) {
                $scope.location = 'No data for your location..';
                $scope.resetRecallData();
            });

            $http.get('/api/market/' + $scope.coords.latitude + '/' + $scope.coords.longitude).then(function(response) {
                $scope.markets = response.data.results;
            }).catch(function(data) {
                $scope.location = 'No data for your location..';
                $scope.markets = [];
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
            if (data.value && data.value !== '' && data.value !== '$closeButton') {
                if (data.value === 'currentLocation') {
                    $scope.resetRecallData();
                    $scope.location = 'Trying to find you...';
                    $scope.getLocationData();
                } else {
                    $scope.zipcode = data.value;
                    $scope.resetRecallData();
                    $scope.location = 'Getting data for ' + $scope.zipcode;
                    $scope.getZipcodeData();
                }
            }
        });
    };

    // Default to running getting data by geolocation
    $scope.getLocationData();
};
