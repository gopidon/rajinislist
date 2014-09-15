/**
 * Created by gopi on 7/11/14.
 */
//Articles service used for articles REST endpoint
angular.module('t2spare.customers').factory("Customers", ['$resource', function($resource) {
    return $resource('customers/:customerId', {
        customerId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])
    .factory( 'CustomerTypesConstant', function() {
        return {
            1: 'Local',
            2: 'National',
            3: 'International'
        };
    });