/**
 * Created by gopi on 8/2/14.
 */
angular.module('t2spare.system')
    .factory("GeolocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
        return function () {
            var deferred = $q.defer();

            if (!Modernizr.geolocation) {
                $rootScope.$apply(function() {
                    deferred.reject(new Error("Geolocation is not supported"));
                });
            } else {
                $window.navigator.geolocation.getCurrentPosition(function (position) {
                    $rootScope.$apply(function() {
                        deferred.resolve(position);
                    });
                }, function (error) {
                    $rootScope.$apply(function() {
                        deferred.reject(error);
                    });
                });
            }

            return deferred.promise;
        };
    }]);