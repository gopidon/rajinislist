/**
 * Created by gopi on 7/11/14.
 */
angular.module('t2spare.customers').controller('CustomersController', ['$scope', '$modal', '$location','$timeout','$log' ,'Global', 'Customers','CustomerTypesConstant','Lookups', function ($scope, $modal, $location,$timeout, $log ,Global, Customers, CustomerTypesConstant, Lookups) {
    $scope.global = Global;

    $scope.date = new Date();

    $scope.openTP = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedTP = true;
    };


    $scope.cusTypes = CustomerTypesConstant;
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
                                        {field:'name',
                                            displayName:'Name',
                                            enableCellEdit : true,
                                            editableCellTemplate: $scope.cellInputEditableTemplate },
                                        {field:'description',
                                         displayName:'Description',
                                            enableCellEdit : true,
                                            editableCellTemplate: $scope.cellInputEditableTemplate},
                                        {field:'age', displayName:'Age'},
                                        {field:'type',
                                            displayName:'Type',
                                            editableCellTemplate: $scope.cusTypeTemplate,
                                            cellFilter: 'CustomerTypesDecode'},
                                        {field:'startdate',
                                         displayName:'Start Date',
                                         enableCellEdit : true,
                                         editableCellTemplate: $scope.cellDateEditableTemplate,
                                         cellFilter: 'date:global.dateFormat'},
                                        {field:'from',
                                            displayName:'From',
                                            enableCellEdit : true,
                                            editableCellTemplate: $scope.cellTimeEditableTemplate,
                                            cellFilter: 'date:global.isMeridian?global.timeFormatMeridian:global.timeFormat'},
                                        {field:'to',
                                            displayName:'To',
                                            enableCellEdit : true,
                                            editableCellTemplate: $scope.cellTimeEditableTemplate,
                                            cellFilter: 'date:global.isMeridian?global.timeFormatMeridian:global.timeFormat'},
                                        {field:'lookup.value',
                                            displayName:'City',
                                            enableCellEdit : true,
                                            editableCellTemplate: $scope.cellTypeaheadEditableTemplate
                                        }
                            ]

                         };

    //Deal with datepickers
    $scope.openDatePicker = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openDP = true;
    };

    $scope.getCities = function(val) {
        $scope.loadingCities = true;
       return Lookups.get({
            lookupType: 'city',
            lookupTypeValue: val
        }).$promise.then(function(data) {
            var cities = [];
           angular.forEach(data, function(item){
               cities.push({"id":item.id,"value":item.value});
           });
            //console.log(cities);
            $scope.loadingCities = false;
            return cities;
        });

    };

    $scope.citySelected = function($item, $model, $label){
        //console.log($scope.newCustomer.lookupId);
        console.log($item);
        console.log($model);
        console.log($label);

        var customer = $scope.mySelections[0];
        customer.LookupId = $model.id;

        customer.$update(function(res){
            customer.lookup.id = $model.id;
            customer.lookup.value = $model.value;
            $log.debug("SAVED!!!");
        });

    };


    $scope.updateEntity = function(row) {

        if(!$scope.save) {
            $scope.save = { promise: null, pending: false, row: null };
        }
        $scope.save.row = row.rowIndex;
        if(!$scope.save.pending) {
            $scope.save.pending = true;
            $scope.save.promise = $timeout(function(){
                // $scope.list[$scope.save.row].$update();
                console.log("Before save:");
                console.log($scope.myData[row.rowIndex]);
                $scope.myData[row.rowIndex].$update(function(res){
                    console.log("Saved!");
                });
                $scope.save.pending = false;
            }, 500);
        }
    };

    $scope.hello = function()
    {
        console.log('Hello');
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
                $scope.createCustomer(selectedItem);
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
                $scope.deleteCustomer();
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
                $scope.updateCustomer();
            }

        });
    };

    var ModalInstanceCtrl = function ($scope, $modalInstance, items,$timeout) {

        $scope.customer = items[0];
        $scope.newCustomer = {from:new Date(), to: new Date()};


        //deal with datepicker popup

        $scope.open = function($event) {
           $event.preventDefault();
           $event.stopPropagation();
           $scope.opened = true;
        };



        $scope.create = function () {
            $modalInstance.close($scope.newCustomer);// Don't have to return the new customer but....
        };

        $scope.update = function () {
            $modalInstance.close($scope.customer);
        };

        $scope.delete = function () {
            $modalInstance.close("delete");
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.create = function() {

        var customer = new Customers({
            name: this.name,
            description: this.description
        });

        customer.$save(function(response) {
            console.log(response);
            //$location.path("customers/");
        });

        this.name = "";
        this.description = "";
    };

    $scope.createCustomer = function(newCustomer) {
        var customer = new Customers({
            name: newCustomer.name,
            description: newCustomer.description,
            age: newCustomer.age,
            type: newCustomer.type,
            startdate: newCustomer.startdate,
            from: newCustomer.from,
            to: newCustomer.to,
            LookupId: newCustomer.lookup.id
        });

        customer.$save(function(response) {
            response.lookup = {"id":newCustomer.lookup.id, "value":newCustomer.lookup.value}; //manually populate. Eager loading not working on the server side.
            newCustomer = response;
            $scope.customers.unshift(newCustomer);
            $scope.mySelections[0] = newCustomer;
        });


    };

    $scope.find = function() {
        Customers.query(function(customers) {
            $scope.customers = customers;

            $scope.myData = customers;
            $scope.mySelections[0] = $scope.customers[0];


        });
    };

    $scope.remove = function(customer) {
        if (customer) {
            customer.$remove();

            for (var i in $scope.customers) {
                if ($scope.customers[i] == customer) {
                    $scope.customers.splice(i, 1);
                }
            }
        }
        else {
            $scope.customer.$remove();
            for (var j in $scope.customers) {
                if ($scope.customers[j] == customer) {
                    $scope.customers.splice(j, 1);
                }
            }
            $location.path('customers');
        }
    };

    $scope.deleteCustomer = function(){
        var customer = $scope.mySelections[0];
        customer.$remove().then(function(){
            for (var j in $scope.customers) {
                if ($scope.customers[j] == customer) {
                    $scope.customers.splice(j, 1);
                    if($scope.customers[0])
                        $scope.mySelections[0] = $scope.customers[0];
                    break;
                }
            }
        });

    };

    $scope.update = function() {
        var customer = $scope.customer;
        if (!customer.updated) {
            customer.updated = [];
        }
        customer.updated.push(new Date().getTime());

        customer.$update(function() {
            $location.path('customers/' + customer.id);
        });
    };

    $scope.updateCustomer = function() {
        var customer = $scope.mySelections[0];


        customer.$update(function() {
            //$location.path('customers/' + customer.id);
        });
    };

   /* $scope.findOne = function() {
        Customers.get({
            customerId: $routeParams.customerId
        }, function(customer) {
            $scope.customer = customer;
        });
    };*/


}]);

