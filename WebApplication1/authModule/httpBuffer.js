(function () {

    angular.module('authModule').factory('httpBuffer', httpBuffer);

    httpBuffer.$inject = ['$injector'];

    function httpBuffer($injector) {
        var httpBufferFactory = {};

        var buffer = [];
        var $http;

        function retryHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }
            function errorCallback(response) {
                deferred.reject(response);
            }
            $http = $http || $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }

        function append(config, deferred) {
            buffer.push({
                config: config,
                deferred: deferred
            });
        }

        function rejectAll(reason) {
            if (reason) {
                for (var i = 0; i < buffer.length; i++) {
                    buffer[i].deferred.reject(reason);
                }
            }
        }

        function retryAll() {
            for (var i = 0; i < buffer.length; i++) {
                retryHttpRequest(buffer[i].config, buffer[i].deferred);
            }
            buffer = [];
        }

        httpBufferFactory.append = append;
        httpBufferFactory.rejectAll = rejectAll;
        httpBufferFactory.retryAll = retryAll;

        return httpBufferFactory;
    }

}());