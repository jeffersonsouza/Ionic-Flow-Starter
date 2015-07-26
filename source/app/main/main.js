angular.module('flow')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('app.main', {
                url: '/main',
                views: {
                    'menuContent': {
                        templateUrl: 'app/main/templates/main.html',
                        controller: 'MainController'
                    }
                }
            })
    }]);