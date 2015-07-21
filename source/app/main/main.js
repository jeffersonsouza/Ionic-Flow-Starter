'use strict';
angular.module('flow')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'app/main/templates/main.html',
            controller: 'MainController'
        });
    }])
