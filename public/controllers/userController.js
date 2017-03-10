angular.module('userCtrl', ['userService', 'ngRoute'])
        .controller('UserCtrl', function (UserService) {
            var ctrl = this;
            UserService.getUser()
                    .success(function (data) {
                        ctrl.userData = data;
                    });

            ctrl.getAllUsers = function () {
                UserService.all()
                        .success(function (data) {
                            ctrl.users = data;
                        });
            };


            ctrl.updateUser = function () {
                ctrl.message = '';
                console.log(ctrl.userData);
            };

        })

        .controller('UserCreateCtrl', function (UserService, $location, $window, $route, $routeParams, Auth) {
            var ctrl = this;

            ctrl.signupUser = function () {
                ctrl.message = '';
                UserService.create(ctrl.userData)
                        .then(function (response) {
                            ctrl.userData = ''; //clear input
                            ctrl.message = response.data.message;

                            $window.localStorage.setItem('token', response.data.token); //set token + redirect
                            $location.path('/');
                        });
            };

            //Redirect to Home if already Token 
            ctrl.isLoggedIn = Auth.isLoggedIn();
            if (ctrl.isLoggedIn) {
                $location.path('/');
            }

            if ($routeParams.token) {
                var token = $routeParams.token;
                $window.localStorage.setItem('token', token); //set token
                $location.path('/');
            }

        });
