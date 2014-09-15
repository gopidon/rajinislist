angular.module('t2spare.customers')
.filter('CustomerTypesDecode', function( CustomerTypesConstant ) {
    return function(input) {
        if (CustomerTypesConstant[input]) {
            return CustomerTypesConstant[input];
        } else {
            return 'Unknown';
        }
    };
});