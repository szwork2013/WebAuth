(function () {

    angular.module('authModule').factory('httpAuthInterceptor', httpAuthInterceptor);

    httpAuthInterceptor.$inject = ['$q', 'httpBuffer', '$rootScope', '$injector', 'localStorageService'];

    function httpAuthInterceptor($q, httpBuffer, $rootScope, $injector, localStorageService) {
        var httpAuthInterceptorFactory = {};


        var _request = function (config) {
            config.headers = config.headers || {};

            var authData = localStorageService.get('localAuthData');

            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.accessToken;
            }
            return config;
        }

        var _responseError = function (rejection) {
            var deferred = $q.defer();
            if (rejection.status === 401) {
                if ((rejection.config.headers.Authorization) && rejection.config.headers.Authorization.indexOf("Bearer") > -1) {
                    httpBuffer.append(rejection.config, deferred);
                    $rootScope.$emit("authModule:refresh_token", { rejection: rejection, deferred: deferred });
                } else {
                    return $q.reject(rejection);
                }
                //return deferred.promise;
            }
            return $q.reject(rejection);
        }


        httpAuthInterceptorFactory.request = _request;
        httpAuthInterceptorFactory.responseError = _responseError;

        return httpAuthInterceptorFactory;
    }

}());