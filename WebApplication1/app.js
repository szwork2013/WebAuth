(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        //'ngRoute'

        // Custom modules 

        // 3rd Party Modules
        'authModule',
        'LocalStorageModule'
    ]);

    app.value("appConfig", {
        authEndpoint: 'http://localhost:65308/token',
        clientId: ''
    });

    app.run(messageHub);
    messageHub.$inject = ['$rootScope', 'httpBuffer', 'authService', '$location'];
    function messageHub($rootScope, httpBuffer, authService, $location) {
        //$rootScope.$on('oauth:error', function (event, data) {
        //    httpBuffer.append(data.rejection.config, data.deferred);
        //    var a = 1;
        //    authService.refresh();
        //});
        //$rootScope.$on('oauth:refreshed', function (event, data) {
        //    var a = 1;
        //    var updater = data || function (config) { return config; };
        //    httpBuffer.retryAll();
        //});

        //$rootScope.$on('oauth:refreshed_failed', function (event, data) {
        //    $location.path("/login");

        //});

        //$rootScope.$on("auth:failed", function (event, data) {
        //    var a = 1;
        //});

        //
    }






    


    



    //app.factory('authInterceptorService', authInterceptorService);

    //authInterceptorService.$inject = ['$q', '$injector', '$location', 'appcfg', 'httpBuffer', '$rootScope'];

    //function authInterceptorService($q, $injector, $location, appcfg, httpBuffer, $rootScope) {
    //    var authInterceptorServiceFactory = {};


    //    var _request = function (config) {
    //        config.headers = config.headers || {};
    //        if (appcfg.user.token) {
    //            config.headers.Authorization = 'Bearer ' + appcfg.user.token;
    //        }
    //        return config;
    //    }

    //    var _responseError = function (rejection) {
    //        var deferred = $q.defer();
    //        if (rejection.status === 401) {
    //            $rootScope.$emit("oauth:error", { rejection: rejection, deferred: deferred });
    //            return deferred.promise;
    //        }
    //        return $q.reject(rejection);
    //    }

    //    authInterceptorServiceFactory.request = _request;
    //    authInterceptorServiceFactory.responseError = _responseError;
    //    return authInterceptorServiceFactory;
    //}

    app.controller('main', mainController);

    mainController.$inject = ['$http', 'userService', 'authService'];

    function mainController($http, userService, authService) {
        var vm = this;

        vm.user = userService.user;

        vm.loginForm = {
            username: '',
            password: ''
        };

        vm.testapi = function () {
            $http({
                url: 'http://localhost:65281/api/secure',
                method: 'GET'
            }).then(function (response) {
                vm.debug = response;
            }, function (error) {
                vm.debug = error;
            })
        }

        vm.logout = function () {
            authService.logout();
        }

        vm.login = function () {

            authService.login(vm.loginForm.username, vm.loginForm.password).
            then(function () {
                var a = 1;
            }, function (errormessage) {
                var a = 1;
            });
        }

        //vm.rlogin = function () {
        //    var data = "grant_type=refresh_token&refresh_token=" + vm.user.rtoken;

        //    $http({
        //        url: 'http://localhost:65308/token',
        //        method: 'POST',
        //        data: data,
        //        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //    }).then(function (response) {
        //        vm.debug = response;
        //        vm.user.token = response.data.access_token;
        //        vm.user.rtoken = response.data.refresh_token;
        //        vm.user.rtokenexp = Date.parse(response.data[".expires"]);
        //        vm.user.roles = JSON.parse(response.data.roles);
        //        appcfg.user = vm.user;
        //    }, function (error) {
        //        vm.debug = error;
        //    });
        //}

        //vm.login = function () {

        //    userService.login(vm.loginForm.username, vm.loginForm.password);

        //    var data = "grant_type=password&username=" + vm.loginForm.username + "&password=" + vm.loginForm.password;

        //    $http({
        //        url: 'http://localhost:65308/token',
        //        method: 'POST',
        //        data: data,
        //        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        //    }).then(function (response) {
        //        vm.debug = response;
        //        vm.user.token = response.data.access_token;
        //        vm.user.rtoken = response.data.refresh_token;
        //        vm.user.roles = JSON.parse(response.data.roles);
        //        vm.user.rtokenexp = Date.parse(response.data[".expires"]);
        //        appcfg.user = vm.user;
        //    }, function (error) {
        //        vm.debug = error;
        //    });
        //    vm.message = 'sent';
        //}

    }

})();