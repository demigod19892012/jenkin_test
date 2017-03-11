/**
 * Created by quocviet on 11/30/15.
 */
/**
 * Angular directive to display google map and working with it
 *
 * @Requirement
 * - (required) angular-translate library
 * - (required) angular-google-maps library https://angular-ui.github.io/angular-google-maps/#!/use
 *
 * @Installation
 *  1. Install the above library
 *  2. Get a key from Google Api V3 console
 *  3. Add key to config, for example:
 *    angular.module('app.config.googleMap', []).config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
          key: 'AIzaSyD2ck0xS5dOJCg1Vuc1zUHuwMl113Y39Kk',
          v: '3.20', //defaults to latest 3.X anyhow
          libraries: 'weather,geometry,visualization'
        });
      })
 *
 * @Params
 *  @param control {array} will hold all the control functions of the directive
 *  @param center {array} format: {latitude: lat_value, longitude: long_value}  Will set the map center to selected point
 *  @param zoom {int} the zoom level of the map
 *  @param refreshFlag {bool} If the map can be hide/show, we need this flag to reset the display of map
 *  @param mode {array} Mode of the map we will using. Check the following map mode
 *    mode = {
 *      clickToDropMarker: bool,          If set, it will allow use to drop marker on the position where user hit the map
 *      parseGeocodeOnMarkerSet: bool,         If set, we will call google api to get the geocode when a marker is set, and will return in event
 *    }
 *
 */
angular.module('open_source.directives.qvGoogleMap', []).directive('qvGoogleMap', [
  function() {
    return {
      restrict: 'E',
      scope: {
        control: '=',
        center: '=',
        zoom: '=',
        mode: '=',
      },
      templateUrl: 'components/directives/qvGoogleMap/tpl/qvGoogleMap.html',
      replace: true,
      controller: function($scope, $element, uiGmapIsReady) {
        /* ============================= [INPUT PARAMS] ============================= */
        $scope.mapMode = ($scope.mode)?$scope.mode:{
          clickToDropMarker: false,
          parseGeocodeOnMarkerSet: false,
        };
        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [PARAMS] ============================= */
        $scope.events = {                                           //hold the event for the map
          click: function(map, eventName, originalEventArgs){
            $scope.onMapClick(map, eventName, originalEventArgs);
          },
        }

        $scope.markers = [];                                        //list of marker on the map
        $scope.geocoder = new google.maps.Geocoder();               //geo coder for geo parser
        /* ============================= [END PARAMS] ============================= */

        /* ============================= [EVENT] ============================= */
        /**
         * Init function which will call when directive is created
         */
        $scope.init = function(){
          //when map is create, we will trigger the resize event to display map (if not, when hide, the map will become gray)
          uiGmapIsReady.promise().then(function (maps) {
            google.maps.event.trigger(maps[0].map, 'resize');
          });
        }

        /**
         * Event called when the map is clicked on, wont called if click on marker
         * https://developers.google.com/maps/documentation/javascript/reference#Map
         * @param map {object} the map object
         * @param eventName {string} name of the event
         * @param originalEventArgs {array} argument of the origin event (javascript)
         */
        $scope.onMapClick = function(map, eventName, originalEventArgs){
          //get the click position information
          var e = originalEventArgs[0];
          var lat = e.latLng.lat();
          var long = e.latLng.lng();

          //if mode clickToDropMarker is set, we will add a marker when user hit on the map
          if($scope.mapMode.clickToDropMarker){
            $scope.addMarker(null, lat, long);
          }
        }
        /* ============================= [END EVENT] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * @param id {string} id of the marker, if not set, will get date as id
         * @param lat {float} latitude
         * @param long {float} longitue
         * @param icon {string} path to the icon
         */
        $scope.addMarker = function(id, lat, long, icon){
          //set the marker id using timestamp if not set
          var markerId = id;
          if(!markerId){
            markerId = Date.now();
          }

          var marker = {
            id: markerId,
            coords: {
              latitude: lat,
              longitude: long
            },
            icon: icon
          };

          $scope.markers.push(marker);
          $scope.$apply();

          //if the mode parseGeocodeOnMarkerSet is set, we will parse the location when the marker is set
          if($scope.mode.parseGeocodeOnMarkerSet){
            $scope.geocodeLocation(marker.coords.latitude, marker.coords.longitude, function(results){
              console.log(results);
            }, function(errorMessage){
              console.log(errorMessage);
            });
          }
        }

        /**
         * Function to parse a location into geocode information
         * @param lat {float} latitude
         * @param long {float} longitue
         * @param successHandler {callback} Callback function when successfully get geocode data
         *  @callbackParam results {array} geocode results
         * @param failureHandler {callback} Callback function when failed
         *  @callbackParam message {string} error message
         */
        $scope.geocodeLocation = function(lat, long, successHandler, failureHandler){
          if($scope.geocoder){
            var googleLocation = new google.maps.LatLng(lat, long);
            if(googleLocation){
              $scope.geocoder.geocode(
                {
                  latLng: googleLocation
                },
                function(results, status){
                  if (status === google.maps.GeocoderStatus.OK) {
                    if(successHandler){
                      successHandler(results);
                    }
                  } else {
                    if(failureHandler){
                      failureHandler("cannot geocode status: " + status);
                    }
                  }
                },
                function() {
                  if(failureHandler){
                    failureHandler("cannot geocode");
                  }
                }
              );
            }
          }
        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [OUTPUT FUNCTIONS] ============================= */

        /* ============================= [END OUTPUT FUNCTIONS] ============================= */

        /* ============================= [PRECALL] ============================= */
        $scope.init();

        //set all the output functions
        /* ============================= [END PRECALL] ============================= */
      }
    };
  }
]);
