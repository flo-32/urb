angular.module('postCtrl', ['postService', 'ngRoute'])
        .controller('PostCtrl', function (PostService, UserService) {
            var ctrl = this;

            //checkLogin
            UserService.getUser()
                    .then(function (data) {
                        ctrl.showPostInput();
                    });


            ctrl.upload = function (file) {
                ctrl.message = '';
                PostService.upload(file, ctrl);
            };

            ctrl.showPostInput = function () {
                ctrl.postData = {};

                var today = new Date();

                ctrl.minDate = new Date(
                        today.getFullYear(),
                        today.getMonth() - 2,
                        today.getDate()
                        );

                ctrl.maxDate = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                        );

                var countries = {
                    availableOptions: [
                        {id: '1', name: 'Germany'},
                        {id: '2', name: 'Europa'},
                        {id: '3', name: 'North-America'},
                        {id: '4', name: 'Asia'},
                        {id: '5', name: 'Africa'},
                        {id: '6', name: 'Australia'},
                        {id: '7', name: 'Antarctica'},
                        {id: '8', name: 'South-America'},
                        {id: '9', name: 'Zombieland'}
                    ],
                    selectedOption: {id: '1', name: 'Germany'} //This sets the default value of the select in the ui
                };

                var states = {
                    availableOptions: [
                        {id: '0', name: '-- Select State --'},
                        {id: '1', name: 'Berlin'},
                        {id: '2', name: 'Sachsen'},
                        {id: '3', name: 'Sachsen-Anhalt'},
                        {id: '4', name: 'Thüringen'},
                        {id: '5', name: 'Bayern'},
                        {id: '6', name: 'Baden-Würtemberg'}
                    ],
                    selectedOption: {id: '0', name: 'Select State'} //This sets the default value of the select in the ui
                };

                ctrl.postData.country = countries;
                ctrl.postData.state = states;
                ctrl.postData.date = today;
            };

        });
