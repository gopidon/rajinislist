angular.module('t2spare',
                ['ngCookies', 'ngResource', 'ngAnimate',
                 'ui.router', 'ngGrid' , 'ui.bootstrap',
                 'ui.bootstrap.custom' ,'ui.route','pascalprecht.translate',
                 't2spare.system', 't2spare.articles','t2spare.customers','t2spare.users',
                 't2spare.shows',
                 'google-maps'])

.config(['$translateProvider','$logProvider',function($translateProvider, $logProvider) {

        $logProvider.debugEnabled(true);
        $translateProvider.preferredLanguage('en');
        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });
}])
.run(function ($rootScope, $state, Global) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if ((toState.name != "home") && !(Global.authenticated)){
                // User isn’t authenticated
                $state.transitionTo("home");
                event.preventDefault();
            }
        });
});

angular.module('t2spare.system', []);
angular.module('t2spare.articles', []);
angular.module('t2spare.customers', []);
angular.module('t2spare.users', []);
angular.module('t2spare.shows', []);