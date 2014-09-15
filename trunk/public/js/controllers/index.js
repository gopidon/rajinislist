angular.module('t2spare.system')
.controller('IndexController', ['$scope','$window','$log','Global','GeolocationService', 'Shows','$timeout',function($scope, $window, $log, Global, geolocation, Shows,$timeout){
    $scope.global = Global;
    $scope.searchListingTerm = "";


    //Get all shows
    $scope.fetchAllShows = function() {
        Shows.query({limit:10},function (shows) {
            $scope.shows = shows;

        });
    };

    $scope.fetchShowsByKey = function(){
        var search = $scope.searchListingTerm;
        Shows.query({key: search,limit:-1}).$promise.then(function (shows) {
            $scope.shows = shows;
        });
    };



    $scope.map = { //Default to Paris!
        center: {
            latitude: 48.85,
            longitude: 2.35
        },
        draggable: true,
        zoom: 12,
        bounds: {}
    };

    $scope.marker = {
            id:0,
            coords: {
                latitude: 17.0575707,
                longitude: 79.26202940000007
            },
            options: { draggable: false },
            events: {
                dragend: function (marker, eventName, args) {
                    $log.debug('marker dragend');
                    $log.debug(marker.getPosition().lat());
                    $log.debug(marker.getPosition().lng());
                }
            }
    };

    geolocation().then(function(position){
        //$log.debug(position);
        $timeout(function(){
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longitude = position.coords.longitude;
        }, 0);
    }, function(reason){
            $log.debug("Couldn't determine geolocation:"+JSON.stringify(reason));
    });

}]);