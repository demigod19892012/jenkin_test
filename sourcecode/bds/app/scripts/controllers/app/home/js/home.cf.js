/**
 * Created by quocviet on 12/16/15.
 */
angular.module('app.controllers.homepage')
  .factory('homepageCf', function ($translate, constants) {
    var configurations = {};

    /**
     * Return the configuration of the search map on search page
     * @param $scope  Main scope pass from controller
     * @returns {data} Configuration data
     */
    configurations.mapCf = function($scope) {
      return {
        control: {},
        center: {
          lat: 17.024484,
          lng: 105.836520,
          zoom: 6
        },
        mapControls: [
        ],
        events: {

        }
      };
    };

    /**
     * Return the configuration of the search field
     * @param $scope  Main scope pass from controller
     * @returns {data} Configuration data
     */
    configurations.searchCf = function($scope){
      return {

      }
    }

    /**
     * Return the events configuration of the search field
     * @param $scope  Main scope pass from controller
     * @returns {data} Configuration data
     */
    configurations.searchEventsCf = function($scope){
      return {
        onAddressComponentChanged: function(datas, type){
          $scope.onSelectAddressComponentFromSearch(datas, type);
        }
      }
    }

    return configurations;
  }
);
