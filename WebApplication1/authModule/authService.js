(function () {

    angular.module('authModule').factory('authService', authService);

    authService.$inject = ['httpBuffer', '$injector', 'appConfig', '$rootScope', 'userService', '$q', 'localStorageService'];

    function authService(httpBuffer, $injector, appConfig, $rootScope, userService, $q, localStorageService) {
        var authServiceFactory = {};

        var $http = $injector.get("$http");

        $rootScope.$on("authModule:refresh_token", function (rejection, deferred) {

            var authData = localStorageService.get('localAuthData');
            if (authData.refreshToken) {
                
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken;

                $http({
                    url: appConfig.authEndpoint,
                    method: 'POST',
                    data: data
                }).then(function (response) {
                    userService.setAuthData(
                    response.data.userName,
                    response.data.access_token,
                    response.data.refresh_token,
                    JSON.parse(response.data.roles)
                    );
                    httpBuffer.retryAll();
                }, function (error) {
                    var a = 1;
                    userService.clearAuthData();
                    deferred.reject(rejection);
                });

            } else {
                deferred.reject(rejection);
            }

            

            


        });

        function refreshToken(refreshToken) {
            var deferred = $q.defer();



            return deferred.promise;
        }

        function refresh() {
            var data = "grant_type=refresh_token&refresh_token=" + appcfg.user.rtoken;
            $http({
                url: 'http://localhost:65308/token',
                method: 'POST',
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                appcfg.user.token = response.data.access_token;
                appcfg.user.rtoken = response.data.refresh_token;
                appcfg.user.rtokenexp = Date.parse(response.data[".expires"]);
                appcfg.user.roles = JSON.parse(response.data.roles);
                $rootScope.$emit("oauth:refreshed", {});
            }, function (error) {
                //vm.debug = error;
                $rootScope.$emit("oauth:refreshed_failed", {});
            });
        }

        //authServiceFactory.refresh = refresh;

        var _login = function (username, password) {

            var deferred = $q.defer();

            function onSuccess(response) {
                userService.setAuthData(
                    response.data.userName,
                    response.data.access_token,
                    response.data.refresh_token,
                    JSON.parse(response.data.roles)
                    );
                deferred.resolve();
            }

            function onError(error) {
                //$rootScope.$emit("auth:failed", { errormessage: error.data.error, errordescription: error.data.error_description });
                deferred.reject("haha");
            }

            var data = "grant_type=password&username=" + username + "&password=" + password;

            $http({
                url: appConfig.authEndpoint,
                method: 'POST',
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(onSuccess, onError);

            return deferred.promise;

        };

        var _logout = function () {
            userService.clearAuthData();
        }

        authServiceFactory.login = _login;
        authServiceFactory.logout = _logout;

        return authServiceFactory;
    }

}());