/**
 * Created by gopi on 8/11/14.
 */
/**
 * Created by gopi on 7/11/14.
 */
angular.module('t2spare.shows').controller('ShowsController', ['$scope', '$modal', '$location','$timeout','$log' ,'Global','Shows', '$stateParams', function ($scope, $modal, $location,$timeout, $log ,Global, Shows, $stateParams) {
    $scope.global = Global;
    $scope.date = new Date();

    $scope.showId = $stateParams.showId;


    $scope.openTP = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedTP = true;
    };


    $scope.cellInputEditableTemplate = '<input ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-blur="updateEntity(row)" />';
    $scope.cusTypeTemplate = '<select ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" ng-options="id as type for (id, type) in cusTypes" ng-blur="updateEntity(row)" />';
    $scope.cellDateDisplayTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text>{{COL_FIELD | date: global.dateFormat}}</span></div>';
    $scope.cellDateEditableTemplate = '<input ng-class="\'colt\' + col.index" ng-click="openDP=true" ng-model="COL_FIELD" ng-blur="updateEntity(row)" datepicker-popup="{{global.dateFormat}}" is-open="openDP" datepicker-append-to-body="true" />';
    //$scope.cellTimeEditableTemplate = '<div><timepicker ng-class="\'colt\' + col.index" ng-input="COL_FIELD" ng-model="COL_FIELD" hour-step="global.hourStep" minute-step="global.minStep" ng-blur="updateEntity(row)" show-meridian="global.isMeridian"></timepicker></div>';
    $scope.cellTimeEditableTemplate = '<input ng-class="\'colt\' + col.index" ps-input-time sy-timepicker-popup="global.isMeridian?global.timeFormatMeridian:global.timeFormat" show-meridian="global.isMeridian" ng-blur="updateEntity(row)" is-open="openTP" ng-click="openTP=true" ng-model="COL_FIELD" show-seconds="false" sy-timepicker-append-to-body="true"/>';
    $scope.cellTypeaheadEditableTemplate = '<input type="text" ng-class="\'colt\' + col.index" data-ng-model="COL_FIELD"  typeahead-on-select="citySelected($item, $model, $label)" placeholder="Start typing ..." typeahead="city as city.value for city in getCities($viewValue)" typeahead-append-to-body="true">';
    $scope.myData=[];
    $scope.mySelections = [];
    $scope.gridOptions = { data: 'myData',
        enableCellSelection: true,
        enableRowSelection: true,
        enableCellEdit: true,

        multiSelect: false,
        selectedItems: $scope.mySelections,
        columnDefs: [{field:'id'},
            {field:'show_name',
                displayName:'Name',
                enableCellEdit : true
                //editableCellTemplate: $scope.cellInputEditableTemplate
            },
            {field:'show_venue',
                displayName:'Venue',
                enableCellEdit : true
                //editableCellTemplate: $scope.cellInputEditableTemplate
            },

            {field:'show_time',
                displayName:'Show Time',
                enableCellEdit : false,
                width: "20%",
                //editableCellTemplate: $scope.cellDateEditableTemplate,
                cellFilter: $scope.global.isMeridian?'date:global.dateTimeFormatMeridian':'date:global.dateTimeFormat'},

            {field:'contact_phone',
                displayName:'Phone',
                enableCellEdit : true
                //editableCellTemplate: $scope.cellTypeaheadEditableTemplate
            },
            {field:'contact_email',
                displayName:'Email',
                enableCellEdit : true
                //editableCellTemplate: $scope.cellTypeaheadEditableTemplate
            },
            {field:'contact_notes',
                displayName:'Notes',
                enableCellEdit : true
                //editableCellTemplate: $scope.cellTypeaheadEditableTemplate
            }
        ]

    };

    //Deal with datepickers
    $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openDP = true;
    };

    $scope.openCreateModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'createModal.html',
            controller: ModalInstanceCtrl,
            size: "lg",
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.mySelections;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            if("cancel" != selectedItem){
                $scope.createShow(selectedItem);
            }
        });
    };

    $scope.openDeleteModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'confirmDeleteModal.html',
            controller: ModalInstanceCtrl,
            size: "sm",
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.mySelections;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            if("delete" == selectedItem){
                $scope.deleteShow();
            }

        });
    };

    $scope.openUpdateModal = function () {

        var modalInstance = $modal.open({
            templateUrl: 'updateModal.html',
            controller: ModalInstanceCtrl,
            size: "lg",
            scope: $scope,
            resolve: {
                items: function () {
                    return $scope.mySelections;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            if("cancel" != selectedItem){
                $scope.updateShow();
            }

        });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, items, $timeout) {

        $scope.show = items[0];
        $scope.newShow = {show_time:new Date()};
        $scope.show_venue_details = {location:""};


        //deal with datepicker popup

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };



        $scope.create = function () {
            $scope.newShow.show_venue_details = JSON.stringify($scope.show_venue_details);
            $modalInstance.close($scope.newShow);// Don't have to return the new show but....
        };

        $scope.update = function () {
            $modalInstance.close($scope.show);
        };

        $scope.delete = function () {
            $modalInstance.close("delete");
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };



    $scope.createShow = function(newShow) {
        var show = new Shows({
            show_name: newShow.show_name,
            show_venue: newShow.show_venue,
            show_venue_details: newShow.show_venue_details,
            show_time: newShow.show_time,
            UserId: $scope.global.user.id,
            contact_phone: newShow.contact_phone,
            contact_email: newShow.contact_email,
            contact_notes: newShow.contact_notes
        });

        show.$save(function(response) {

            newShow = response;
            $scope.shows.unshift(newShow);
            $scope.mySelections[0] = newShow;
        });


    };

    $scope.find = function() {
        Shows.query({limit:-1},function(shows) {
            $scope.shows = shows;

            $scope.myData = shows;
            $scope.mySelections[0] = $scope.shows[0];


        });
    };

    $scope.findShowsByUser = function(){
        var userId = $scope.global.user.id;
        Shows.query({userId: userId, limit:-1}).$promise.then(function (shows) {
            $scope.shows = shows;

            $scope.myData = shows;
            $scope.mySelections[0] = $scope.shows[0];
        });
    };

    $scope.findShowById = function(){
        var showId = $scope.showId;
        Shows.get({showId: showId, limit:-1}).$promise.then(function (show) {
            $scope.show = show;
        });
    };



    $scope.deleteShow = function(){
        var show = $scope.shows[0];
        show.$remove().then(function(){
            for (var j in $scope.shows) {
                if ($scope.shows[j] == show) {
                    $scope.shows.splice(j, 1);
                    if($scope.shows[0])
                        $scope.mySelections[0] = $scope.shows[0];
                    break;
                }
            }
        });

    };



    $scope.updateShow = function() {
        var show = $scope.mySelections[0];


        show.$update(function() {

        });
    };




}]);

