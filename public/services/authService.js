angular.module('authService', [])

        .factory('Auth', function ($http, $q, AuthToken) {
            var authFactory = {};

            authFactory.login = function (email, password) {
                return $http.post('/api/login', {
                    email: email,
                    password: password
                }).success(function (data) {
                    AuthToken.setToken(data.token);
                    return data;
                });
            };

            authFactory.logout = function () {
                AuthToken.setToken();
            };

            authFactory.isLoggedIn = function () {
                if (AuthToken.getToken()) {
                    return true;
                } else {
                    return false;
                }
            };

            authFactory.getUser = function () {
                if (AuthToken.getToken()) {
                    return $http.get('/api/me');
                } else {
                    return $q.reject({
                        message: "User has no token!"
                    });
                }
            };

            authFactory.getUserPosts = function () {
                if (AuthToken.getToken()) {
                    return $http.get('/api/myPosts');
                } else {
                    return $q.reject({
                        message: "User has no token!"
                    });
                }
            };

            return authFactory;
        })

        .factory('AuthToken', function ($window) {
            var authTokenFactory = {};

            authTokenFactory.getToken = function () {
                var token = $window.localStorage.getItem('token');
                return token !== 'undefined' ? token : false;
            };

            authTokenFactory.setToken = function (token) {
                if (token) {
                    $window.localStorage.setItem('token', token);
                } else {
                    $window.localStorage.removeItem('token');
                }
            };

            return authTokenFactory;

        })

        .factory('AuthInterceptor', function ($q, $location, AuthToken) {
            var interceptorFactory = {};
            interceptorFactory.request = function (config) {
                var token = AuthToken.getToken();
                if (token) {
                    config.headers['x-access-token'] = token;
                }
                return config;
            };

            return interceptorFactory;
        })

        .factory('responseObserver', function responseObserver($q, $location, AuthToken) {
            return {
                'responseError': function (errorResponse) {
                    switch (errorResponse.status) {
                        case 403:
                            console.log("403 - logout");
                            //Logout
                            AuthToken.setToken();
                            $location.path('/login');
                            break;
                    }
                    return $q.reject(errorResponse);
                }
            };
        });
