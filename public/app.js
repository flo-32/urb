'use strict';
var app = angular.module('urbApp', ['appRoutes', 'mainController', 'authService', 'userCtrl', 'userService', 'ngFileUpload', 'postCtrl', 'postService', 'ngMaterial', 'ngImgCrop', 'timelineCtrl'])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
            $httpProvider.interceptors.push('responseObserver');
        });
