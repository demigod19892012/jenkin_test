/**
 * Created by quocviet on 11/17/15.
 */
/**
 * Directive to create the main search engine for the app
 * @Requirement:
 * - (required) httpRequest: from component/services/http/httpRequest.js
 * - (required) angular-translate library
 * - (required) angular-google-maps library https://angular-ui.github.io/angular-google-maps/#!/use
 * - (optional) angular-material library: css and js
 * - (optional) ngEnter library: from component/directives/input/keyboard/qvKeyboardInput.js
 *
 * @Configuration
 * 1.Input Params
 *  @param config {dict} Configuration for the search form
 *    @configParam hideSearchOptions {bool} true to hide the advance search tools, false to display it (or not set)
 *
 *  @param events {dict} Configuration for the search form events
 *    @onAddressComponentChanged
 *      @param datas {array} list of address component data which we selected
 *      @param type {string} type of address component from constants.geo.component.type
 */
angular.module('app.directives.bdsSearch', []).directive('bdsSearch', ['$timeout', '$mdDialog',
  function($timeout, $mdDialog) {
    return {
      restrict: 'E',
      scope: {
        config: '=',
        events: '=',
      },
      templateUrl: 'scripts/components/directives/sections/search/tpl/bdsSearch.html',
      replace: true,
      controller: function ($scope, $q, $translate, httpRequest, api, projectServices, investorServices, geoServices, constants, arrayServices) {
        /* ================================ [PARAMS] ================================ */
        $scope.searchTerm = null;                                                 //current search string

        $scope.currentSearchTarget = 'project';                                   //selected search target
        $scope.searchTargets = {
          'project': 'project',
          'investor': 'investor',
        }

        $scope.searchProjectOptions = {                                           //option to search for project
          'address': 'address',
          'price': 'price',
          'status': 'status',
          'type': 'type',
          'investor': 'investor',
        }

        $scope.originSearchProjectData = {                                       //hold the status of current search setting
          currentOptions : null,                                                  //which option is current open (controls expand in the UI)
          searchData: {                                                           //search data for each option
            'address': {
              'city': null,
              'cities': null,
              'areas': null,
              'localities': null,
              'routes': null,
            },
            'price': null,
            'status': null,
            'type': null,
            'investor': null,
          }
        }

        $scope.currentSearchProjectData = angular.copy($scope.originSearchProjectData);
        /* ================================ [END PARAMS] ================================ */

        /* ================================ [CONFIGURATION] ================================ */
        /* The configuration for city single selector */
        $scope.selectCityConf = {
          control: {},
          items: function(successHandler, failureHandler){
            geoServices.fetchAddressComponents({'country': 'VN'}, constants.geo.component.type.city, function(components, total){
              successHandler(components, total);
            }, function(message){
              failureHandler(message);
            });
          },
          labelKey: 'value',
          onCitySelected: function(city){
            //when there is a change, we will need to reload the other items
            $scope.reloadAreas();

            //call event is set
            if($scope.events && $scope.events.onAddressComponentChanged){
              var cities = [];
              if(city){
                cities = [city];
              }
              $scope.events.onAddressComponentChanged(cities, constants.geo.component.type.city);
            }
          }
        }

        /* The configuration for city multi selector */
        $scope.selectCitiesConf = {
          control: {},
          items: function(successHandler, failureHandler){
            geoServices.fetchAddressComponents({'country': 'VN'}, constants.geo.component.type.city, function(components, total){
              successHandler(components, total);
            }, function(message){
              failureHandler(message);
            });
          },
          translation: {
            selectAll       : $translate.instant('TRANS_SELECT_ALL'),
            selectNone      : $translate.instant('TRANS_SELECT_NONE'),
            reset           : $translate.instant('TRANS_RESET'),
            search          : $translate.instant('TRANS_SEARCH'),
            nothingSelected : $translate.instant('TRANS_SEARCH_ALL_CITY'),
          },
          buttonValue: 'value',
          itemLabel: 'value',
          tickProperty: 'selected',
          searchProperty: 'non_unicode_value',
          onCitySelected: function(data){
            //when there is a change, we will need to reload the other items
            $scope.reloadAreas();

            //call event is set
            if($scope.events && $scope.events.onAddressComponentChanged){
              var cities = $scope.currentSearchProjectData.searchData.address.cities;
              $scope.events.onAddressComponentChanged(cities, constants.geo.component.type.city);
            }
          }
        }

        /* The configuration for areas multi selector */
        $scope.selectAreasConf = {
          control: {},
          items: function(successHandler, failureHandler){
            var data = {};
            // we need to get list of selected cities
            if($scope.currentSearchProjectData.searchData.address.city){
              var cityCodes = [$scope.currentSearchProjectData.searchData.address.city.key];

              data.cities = cityCodes;
            }

            geoServices.fetchAddressComponents(data, constants.geo.component.type.area, function(components, total){
              successHandler(components, total);
            }, function(message){
              failureHandler(message);
            });
          },
          translation: {
            selectAll       : $translate.instant('TRANS_SELECT_ALL'),
            selectNone      : $translate.instant('TRANS_SELECT_NONE'),
            reset           : $translate.instant('TRANS_RESET'),
            search          : $translate.instant('TRANS_SEARCH'),
            nothingSelected : $translate.instant('TRANS_SEARCH_ALL_AREA'),
          },
          buttonValue: 'value',
          itemLabel: 'value',
          tickProperty: 'selected',
          searchProperty: 'non_unicode_value',
          onAreaSelected: function(data){
            //when there is a change, we will need to reload the other items
            $scope.reloadLocalities();
          }
        }

        /* The configuration for localities multi selector */
        $scope.selectLocalitiesConf = {
          control: {},
          items: function(successHandler, failureHandler){
            var data = {};
            // we need to get list of selected areas
            if($scope.currentSearchProjectData.searchData.address.areas && $scope.currentSearchProjectData.searchData.address.areas.length > 0){
              var areasCode = [];
              angular.forEach($scope.currentSearchProjectData.searchData.address.areas, function(area, key) {
                if(area.key){
                  areasCode.push(area.key);
                }
              });

              data.cities = arrayServices.toStringWithSeparate(areasCode, ',');
            }

            geoServices.fetchAddressComponents(data, constants.geo.component.type.locality, function(components, total){
              successHandler(components, total);
            }, function(message){
              failureHandler(message);
            });
          },
          translation: {
            selectAll       : $translate.instant('TRANS_SELECT_ALL'),
            selectNone      : $translate.instant('TRANS_SELECT_NONE'),
            reset           : $translate.instant('TRANS_RESET'),
            search          : $translate.instant('TRANS_SEARCH'),
            nothingSelected : $translate.instant('TRANS_SEARCH_ALL_LOCALITY'),
          },
          buttonValue: 'value',
          itemLabel: 'value',
          tickProperty: 'selected',
          searchProperty: 'non_unicode_value',
          onLocalitySelected: function(data){
            //when there is a change, we will need to reload the other items
            $scope.reloadRoutes();
          }
        }

        /* The configuration for localities multi selector */
        $scope.selectRoutesConf = {
          control: {},
          items: function(successHandler, failureHandler){
            var data = {};
            // we need to get list of selected areas
            if($scope.currentSearchProjectData.searchData.address.localities && $scope.currentSearchProjectData.searchData.address.localities.length > 0){
              var locaCode = [];
              angular.forEach($scope.currentSearchProjectData.searchData.address.localities, function(local, key) {
                if(local.key){
                  locaCode.push(local.key);
                }
              });

              data.localities = arrayServices.toStringWithSeparate(locaCode, ',');
            }

            geoServices.fetchAddressComponents(data, constants.geo.component.type.route, function(components, total){
              successHandler(components, total);
            }, function(message){
              failureHandler(message);
            });
          },
          translation: {
            selectAll       : $translate.instant('TRANS_SELECT_ALL'),
            selectNone      : $translate.instant('TRANS_SELECT_NONE'),
            reset           : $translate.instant('TRANS_RESET'),
            search          : $translate.instant('TRANS_SEARCH'),
            nothingSelected : $translate.instant('TRANS_SEARCH_ALL_ROUTE'),
          },
          buttonValue: 'value',
          itemLabel: 'value',
          tickProperty: 'selected',
          searchProperty: 'non_unicode_value',
          onRouteSelected: function(data){
          }
        }
        /* ================================ [END CONFIGURATION] ================================ */

        /* ================================ [FUNCTIONS] ================================ */
        /**
         * Clear the search filter to its origin state
         */
        $scope.clearFilter = function(){
          $scope.currentSearchProjectData = angular.copy($scope.originSearchProjectData);
        }

        /**
         * Reload the areas selector when there is a change in data
         */
        $scope.reloadAreas = function(){
          if($scope.currentSearchProjectData.searchData.address.city){
            //reload areas (this will also lead to reload other component like locality route)
            if($scope.selectAreasConf.control.reload){
              $scope.selectAreasConf.control.reload();
            }
          }
          else{
            //clear all if city is not set
            $scope.currentSearchProjectData.searchData.address.areas = null;
            $scope.currentSearchProjectData.searchData.address.localities = null;
            $scope.currentSearchProjectData.searchData.address.routes = null;
          }
        }

        /**
         * Reload the localities selector when there is a change in data
         */
        $scope.reloadLocalities = function(){
          if($scope.currentSearchProjectData.searchData.address.areas && $scope.currentSearchProjectData.searchData.address.areas.length > 0){
            //reload localities (this will also lead to reload other component like route)
            $scope.selectLocalitiesConf.control.reload();
          }
          else{
            $scope.currentSearchProjectData.searchData.address.localities = null;
            $scope.currentSearchProjectData.searchData.address.routes = null;
          }
        }

        /**
         * Reload the routes selector when there is a change in data
         */
        $scope.reloadRoutes = function(){
          if($scope.currentSearchProjectData.searchData.address.localities && $scope.currentSearchProjectData.searchData.address.localities.length > 0){
            $scope.selectRoutesConf.control.reload();
          }
          else{
            $scope.currentSearchProjectData.searchData.address.routes = null;
          }
        }
        /* ================================ [END FUNCTIONS] ================================ */

        /* ================================ [EVENT] ================================ */
        /**
         * Event when user click on a search option of project to display it search ui
         * @param option {string} name of the search option
         */
        $scope.onProjectSearchOptionSelected = function(option){
          if($scope.currentSearchProjectData.currentOptions == option){
            $scope.currentSearchProjectData.currentOptions = null;
            return;
          }
          $scope.currentSearchProjectData.currentOptions = option;
        }

        /**
         * Event when user want to clear all the search option
         */
        $scope.onClearSearchOptions = function(){
          $scope.clearFilter();
        }

        /**
         * Event when user change the search target
         * @param target  {string} target (one of the value in $scope.searchTargets)
         */
        $scope.onSearchTargetChanged = function(target){
          $scope.currentSearchTarget = target;
        }

        /**
         * When search is start (call from anything need to search)
         */
        $scope.search = function(){
          console.log('let search');
        }
        /* ================================ [END EVENTS] ================================ */
      }
    }
  }]
);
