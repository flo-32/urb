angular.module('mainController', [])
        .controller('MainCtrl', function ($rootScope, $location, Auth) {
            var ctrl = this;

            ctrl.isLoggedIn = Auth.isLoggedIn();

            if (ctrl.isLoggedIn) {
                Auth.getUser()
                        .then(function (data) {
                            ctrl.user = data.data;
                        });
            }

            $rootScope.$on('$routeChangeStart', function () {
                console.log("change route in main CTRL");
                ctrl.isLoggedIn = Auth.isLoggedIn();

                if (ctrl.isLoggedIn) {
                    Auth.getUser()
                            .then(function (data) {
                                ctrl.user = data.data;
                            });
                }
            });

            ctrl.doLogin = function () {
                ctrl.processing = true;
                ctrl.error = '';

                Auth.login(ctrl.loginData.email, ctrl.loginData.password)
                        .success(function (data) {
                            ctrl.processing = false;

                            Auth.getUser()
                                    .then(function (data) {
                                        ctrl.user = data.data;
                                    });

                            if (data.success) {
                                $location.path('/');
                            } else {
                                ctrl.error = data.message;
                            }
                        });
            };

            ctrl.doLogout = function () {
                Auth.logout();
                $location.path('/logout');
            };
        });
