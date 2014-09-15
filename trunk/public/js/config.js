angular.module('t2spare').config(['$stateProvider','$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/index.html',
                controller: 'IndexController'
            })
            .state('mylistings', {
                url: '/mylistings',
                templateUrl: 'views/listings/mylistings.html'

            })
            .state('viewListing', {
                url: '/viewListing/:showId',
                templateUrl: 'views/listings/viewListing.html',
                controller: 'ShowsController'

            })
            .state('customers', {
                url: '/customers',
                templateUrl: 'views/customers/list.html'
            })
            .state('signupform', {
                url: '/signupform',
                templateUrl: 'views/users/signupform.html',
                controller: 'SignupFormController'
            })
            .state('userprefs',{
                url:'/userprefs',
                templateUrl: 'views/users/prefs.html',
                controller: 'UserPrefsController'
            })

            // nested states
            // each of these sections will have their own view
            // url will be nested (/form/profile)
            .state('signupform.profile', {
                url: '/profile',
                templateUrl: 'views/users/form-profile.html'
            })

            // url will be /form/interests
            .state('signupform.company', {
                url: '/company',
                templateUrl: 'views/users/form-company.html'
            })

            // url will be /form/payment
            .state('signupform.roles', {
                url: '/roles',
                templateUrl: 'views/users/form-roles.html'
            });

    }
]);

//Setting HTML5 Location Mode
angular.module('t2spare').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);