/**
 * Created by gopi on 8/11/14.
 */
angular.module('t2spare.shows').factory("Shows", ['$resource', function($resource) {
    return $resource('shows/id/:showId/search/:key/user/:userId/limit/:limit', {
        showId: '@id',
        key: '@key',
        userId: '@userId',
        limit: '@limit'
    }, {
        update: {
            method: 'PUT'
        },
        get: {method: 'GET', isArray: false }
    });
}])
    .factory("ShowService",['Shows', function(Shows){
        return {
            findAllShows: function(){
                Shows.query(function(shows) {
                    return shows;
                });
            },
            findShowsByKey: function(key){
                Shows.get({key: key}).$promise.then(function (shows) {
                    return shows;
                });
            },
            findShowsByUser: function(userId){
                Shows.get({userId: userId}).$promise.then(function (shows) {
                    return shows;
                });
            }
        };

    }]);

