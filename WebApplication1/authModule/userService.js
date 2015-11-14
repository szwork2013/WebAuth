(function () {

    angular.module('authModule').factory('userService', userService);

    userService.$inject = ['$rootScope', '$injector', '$q', 'localStorageService'];

    function userService($rootScope, $injector, $q, localStorageService) {
        var userServiceFactory = {};

        //var $http = $http || $injector.get('$http');

        var _settings = {
            clientId: '',
            authEndpoint: 'http://localhost:65308/token'
        };

        var _user = {
            isAuth: false,
            userName: '',
            accessToken: '',
            refreshToken: '',
            roles: []
        };

        var _setAuthData = function (username, accessToken, refreshToken, roles) {
            _user.userName = username;
            _user.accessToken = accessToken;
            _user.refreshToken = refreshToken;
            _user.roles = roles;
            _user.isAuth = true;

            localStorageService.set('localAuthData', {
                accessToken: _user.accessToken,
                refreshToken: _user.refreshToken,
                userName: _user.userName
            });

        };

        var _clearAuthData = function () {
            _user.accessToken = '';
            _user.refreshToken = '';
            _user.userName = '';
            _user.roles = [];
            _user.isAuth = false;
            localStorageService.remove('localAuthData');
        };

        userServiceFactory.user = _user;
        userServiceFactory.setAuthData = _setAuthData;
        userServiceFactory.clearAuthData = _clearAuthData;

        return userServiceFactory;
    }

}());