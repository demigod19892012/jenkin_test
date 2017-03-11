/**
 * Created by quocviet on 11/17/15.
 */
angular.module('app.controllers.homepage')
  .controller('HomepageCtrl', [
    '$scope',
    'homepageCf',
    '$translate',
    'constants',
    function ($scope, homepageCf, $translate, constants) {
      /* ============================= [PARAMS] ============================= */
      $scope.map = homepageCf.mapCf($scope);
      $scope.search = homepageCf.searchCf($scope);
      $scope.searchEvents = homepageCf.searchEventsCf($scope);
      /* ============================= [END PARAMS] ============================= */

      /* ============================= [FUNCTION] ============================= */

      /* ============================= [END FUNCTION] ============================= */

      /* ============================= [EVENTS] ============================= */
      /**
       * Event when user change the search address filter.
       *  @param datas {array} list of address component data which we selected
       *  @param type {string} type of address component from constants.geo.component.type
       */
      $scope.onSelectAddressComponentFromSearch = function(datas, type){
        if(type == constants.geo.component.type.city){
          //when user select city, we have 3 cases: choose one or choose more than one or choose nothing
          if(datas.length > 1){
            //when multi city is select, we move the map out to see the whole country
            $scope.map.center = {
              lat: 17.024484,
              lng: 105.836520,
              zoom: 6
            }
          }
          else if(datas.length == 1){
            //if user only select one city, we will focus the map on that city only
            var city = datas[0];
            if(city.cen_lat && city.cen_long){
              $scope.map.center = {
                lat: city.cen_lat,
                lng: city.cen_long,
                zoom: 13
              }
            }
          }
          else{

          }
        }
      }
      /* ============================= [END EVENTS] ============================= */
    }
  ]
);
