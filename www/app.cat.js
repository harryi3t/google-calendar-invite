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

(function inviteCtrl () {
  'use strict';

  www.controller('inviteCtrl', ['$scope', inviteCtrl]);

  function inviteCtrl($scope) {
    $('#calendar').fullCalendar({
        // put your options and callbacks here
    })
  }
})();
(function loginCtrl () {
  'use strict';

  www.controller('loginCtrl', ['$scope', loginCtrl]);

  function loginCtrl($scope) {
  }
}());