angular.module('appRoutes', ['ngRoute'])

        .config(function ($routeProvider, $locationProvider) {
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/home.html',
                        controller: 'MainCtrl',
                        controllerAs: 'main'
                    })
                    .when('/login', {
                        templateUrl: 'views/user/login.html',
                        controller: 'MainCtrl',
                        controllerAs: 'login'
                    })
                    .when('/signup', {
                        templateUrl: 'views/user/signup.html',
                        controller: 'UserCreateCtrl',
                        controllerAs: 'create'
                    })
                    .when('/profile', {
                        templateUrl: 'views/user/profile.html',
                        controller: 'UserCtrl',
                        controllerAs: 'profile'
                    })
                    .when('/posts', {
                        templateUrl: 'views/posts/posts.html',
                        controller: 'PostCtrl',
                        controllerAs: 'post'
                    })
                    .when('/myPosts', {
                        templateUrl: 'views/timeline/myPosts.html',
                        controller: 'TimelineCtrl',
                        controllerAs: 'post'
                    })
                    .when('/facebook-login/:token', {
                        templateUrl: 'views/home.html',
                        controller: 'UserCreateCtrl'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });

            $locationProvider.html5Mode(true);
        });
