angular.module('t2spare.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }];

    $scope.CustomersMenu = [{
        "title": "View",
        "link": "customers"
    }, {
        "title": "Create New Customer",
        "link": "customers/create"
    }];
    
    $scope.isCollapsed = false;
}]);