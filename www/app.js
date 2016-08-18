'use strict';

var www = angular.module('www', ['ui.router']);
www.constant('SRC_PATH', 'www/');

www.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'SRC_PATH',
  '$urlMatcherFactoryProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider, SRC_PATH,
    $urlMatcherFactoryProvider) {
    $urlRouterProvider.otherwise('/');
    $urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
      .state('/', {
        url: '/',
        templateUrl: SRC_PATH + 'home/home.html',
        controller: 'homeCtrl'
      });
    //$locationProvider.html5Mode(true);
  }
]);
