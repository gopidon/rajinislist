//Global service for global variables
angular.module('t2spare.system')
.factory("Global", [
    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: (typeof window.user != "undefined"),
            dateFormat: 'dd-MMMM-yyyy',
            dateTimeFormat: 'dd-MMMM-yyyy HH:mm',
            dateTimeFormatMeridian: 'dd-MMMM-yyyy hh:mm a',
            timeFormat: 'HH:mm',
            timeFormatMeridian: 'hh:mm a',
            hourStep: 1,
            minStep: 15,
            isMeridian: true
        };

        return _this._data;
    }
]);
