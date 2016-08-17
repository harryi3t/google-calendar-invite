'use strict';

var www = angular.module('www', ['ui.router']);
www.constant('SRC_PATH', 'www/');

www.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'SRC_PATH',
  '$urlMatcherFactoryProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, SRC_PATH,
    $urlMatcherFactoryProvider) {
    $urlRouterProvider.otherwise('/login');
    $urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
      .state('/login', {
        url: '/login',
        templateUrl: SRC_PATH + 'login/login.html',
        controller: 'loginCtrl'
      })
      .state('/invite', {
        url: '/invite',
        templateUrl: SRC_PATH + 'invite/invite.html',
        controller: 'inviteCtrl'
      });
    //$locationProvider.html5Mode(true);
  }
]);
