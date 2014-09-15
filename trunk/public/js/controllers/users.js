/**
 * Created by gopi on 7/12/14.
 */
angular.module('t2spare.users').controller('SignupFormController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    // we will store all of our form data in this object
    $scope.formData = {};

    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };

    $scope.addFromPreviousClass = function(){
        angular.element( document.querySelector( '#signup-form' ) ).removeClass('fromNext');
        angular.element( document.querySelector( '#signup-form' ) ).addClass('fromPrevious');


    };

    $scope.addFromNextClass = function(){
        angular.element( document.querySelector( '#signup-form' ) ).removeClass('fromPrevious');
        angular.element( document.querySelector( '#signup-form' ) ).addClass('fromNext');


    };
}])
.controller('UserPrefsController',['$scope', '$translate' ,'Global',function($scope, $translate ,Global){

    $scope.global = Global;

    $scope.changeLang = function(){
        $translate.use($scope.global.user.lang);
    };

}]);
