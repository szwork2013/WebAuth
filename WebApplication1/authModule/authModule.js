(function () {

    var am = angular.module('authModule', []);

    am.config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpAuthInterceptor');
    });

    am.value("authStorage", {
        accesstoken: '',
        refreshtoken: '',
        tokenendpoint: ''
    });

}());