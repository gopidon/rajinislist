angular.module('t2spare.system')
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                //console.log("Element:"+element[0]);
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                var autocomplete = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    scope.$apply(function() {

                        scope.show_venue_details.location = place.geometry.location;
                        //console.log("Venu is:"+JSON.stringify(scope.show_venue_details));
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });
