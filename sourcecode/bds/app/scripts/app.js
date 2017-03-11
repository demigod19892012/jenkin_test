'use strict';

/**
 * @ngdoc overview
 * @name bdsApp
 * @description
 * # bdsApp
 *
 * Main module of the application.
 */
angular
  .module('bdsApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ui.bootstrap',
    'pascalprecht.translate',
    'cgBusy',
    'isteven-multi-select',
    'uiGmapgoogle-maps',
    'leaflet-directive',

    'open_source.components',
    'app.components',
    'app.model',
    'app.controllers',
    'app.main'
  ])
  .config(function($mdThemingProvider) {
    //we need to register some theme for ngMaterial
    $mdThemingProvider.theme('success-toast');
    $mdThemingProvider.theme('error-toast');
    $mdThemingProvider.theme('default-toast');
  })
  .config(function ($routeProvider) {

    //path to main body template for the app
    var appDefaultTemplate = 'default';
    var adminLoginTemplate = 'adminLogin';

    var authenticationType = {
      none: null,
      user: 'user',
      admin: 'admin',
    }

    $routeProvider
      .when('/', {
        templateUrl: 'scripts/controllers/app/search/html/search.html',
        controller: 'MainCtrl',
        templateMain: appDefaultTemplate,
        authentication: authenticationType.none,
      })
      .when('/search', {
        templateUrl: 'scripts/controllers/app/home/html/home.html',
        controller: 'MainCtrl',
        templateMain: appDefaultTemplate,
        authentication: authenticationType.none,
      })
      .when('/bds-admin/login', {
        templateUrl: 'scripts/controllers/admin/login/html/login.html',
        controller: 'AdminLoginCtrl',
        templateMain: adminLoginTemplate,
        authentication: authenticationType.none,
      })
      .when('/search/:searchTerm', {
        templateUrl: 'scripts/controllers/app/home/html/home.html',
        controller: 'MainCtrl',
        templateMain: appDefaultTemplate,
        authentication: authenticationType.none,
      })
      .otherwise({
        redirectTo: '/'
      });
  });
