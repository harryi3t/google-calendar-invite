'use strict';

var www = angular.module('www', ['ui.router']);

www.config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
  '$urlMatcherFactoryProvider',
  function ($stateProvider, $locationProvider, $urlRouterProvider,
    $urlMatcherFactoryProvider) {
    $urlRouterProvider.otherwise('/');
    $urlMatcherFactoryProvider.strictMode(false);
    $stateProvider
      .state('/', {
        url: '/',
        templateUrl: 'home/home.html',
        controller: 'homeCtrl'
      });
    //$locationProvider.html5Mode(true);
  }
]);
