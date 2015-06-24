'use strict';

module.exports = /*@ngInject*/ function($scope, $http, geolocation) {

    var api = 'https://devis18f.herokuapp.com/api';

    $scope.location = 'Trying to find you...';
    $scope.recallMetadata = null;
    $scope.recallResults = [];
    $scope.markets = [];

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
