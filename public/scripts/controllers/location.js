'use strict';

module.exports = /*@ngInject*/ function($scope) {
    $scope.zipcode = '';

    $scope.setZip = function() {
        $scope.closeThisDialog($scope.zipcode);
    };

    $scope.findLocation = function() {
        $scope.closeThisDialog('currentLocation');
    };
};
