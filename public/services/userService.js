angular.module('userService', [])

.factory('UserService', function($http) {
    var userFactory = {};

    userFactory.create = function(userData) {
        return $http.post('/api/signup', userData);
    };

    userFactory.getUser = function() {
        return $http.get('api/me');
    };

    userFactory.all = function() {
        return $http.get('api/users');
    };

    return userFactory;
});
