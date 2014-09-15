/**
 * Created by gopi on 7/25/14.
 */
/**
 * Created by gopi on 7/11/14.
 */
//Articles service used for articles REST endpoint
angular.module('t2spare.system').factory("Lookups", ['$resource', function($resource) {
    return $resource('lookups/lookup/:lookupId/type/:lookupType/value/:lookupTypeValue', {
        lookupId: '@id',
        lookupType: '@lookup.type',
        lookupTypeValue: '@lookup.value'
    }, {
        update: {
            method: 'PUT'
        },
        get: {method: 'GET', isArray: true }
    });
}]);
