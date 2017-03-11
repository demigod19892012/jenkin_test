/**
 * Created by quocviet on 12/2/15.
 */
/**
 * Angular directive to display leaflet map and working with it
 *
 * @Requirement
 * - (required) angular-translate library
 * - (required) leaflet map library http://leafletjs.com/examples/quick-start.html
 * - (required) https://github.com/tombatossals/angular-leaflet-directive
 * - (required) css for this map directive, locate at styles/directive/qvLeafletMap
 *
 * @Installation
 *  1. Install the above library
 *  2. If you change the folder location, make sure to update templateUrl path
 *  3. Make sure you have id and accesstoken at https://www.mapbox.com/ (This map using data from this site) and set on the $scope.mapbox params below
 *  4. Make sure you give the map an id
 *
 * @Params
 *  @param control {array} will hold all the control functions of the directive (check the control for list of function)
 *  @param center {array} format: [latitude, longitude]  Will set the map center to selected point
 *  @param maxZoom {int} the maximum zoom level of the map
 *  @param minZoom {int} the minimum zoom level of the map
 *  @param geoJson {callback} The function to get the geoJson data
 *   @geoJson_param successHandler {callback} function(geoData, style){} function will return success geo data in geoData param. Style is the style of the geo data
 *   @geoJson_param failureHandler {callback} function(message){} function will return failure message
 *  @param geoJsonStyle {callback} function(feature){} (feature: the geo object) Remember, this need to get a style data as return params. For example
 *      {
          'default': {
            fillColor: "green",                     //fill color of the geo object
            weight: 2,                              //weight of its border
            opacity: 1,                             //the transparent of border
            color: 'white',                         //border color
            dashArray: '3',                       //border is dash and length of each dash is 3px
            fillOpacity: 0.7                      //the transparent of object
          },
          'hovered': {                            //when hover
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          },
          'selected': {                           //when selected
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        }
 *    this data will be set for each feature
 *  @param geoJsonPopup {callback} function(feature, layer) {} return the setting for popup if we want to display one for geoJson object
 *    @return
 *      {
 *        content: {html} html text to display in popup
 *        options: {popup_options} setting for popup, check infor here http://leafletjs.com/reference.html#popup-options
 *        closeOnMouseOut: {bool} true: close the popup when we move the mouse out of the object range,
 *        popup: {callback} function(feature) the setting for the popup will display when hover over the geoJson object. The setting for popup is actually the same with a marker icon
 *          @example: This will display label as popup
 *            function(feature){
 *              return L.divIcon({
                  className: 'label',
                  html: feature.properties.title,
                  iconSize: [100, 40]
                })
 *            }
 *
 *      }
 *  @param paths {dict} array of the paths in the map. More information on path configuration can be found here: http://leafletjs.com/reference.html#path
 *    {
 *      p1: {
            color: '#008000',
            weight: 4,
            latlngs: [ latlong1, latlong2 ]
        },
 *    }
 *  @param mapControls {array} list of the controls we will using on the map. Check for map controls configuration data below
 *
 *  @MapControlsConfigurationParams
 *    @param: id {string} {required} unique id of the controller (unique for each map). Do not forget to set this, otherwise the control will be ignored
 *    @param: type {string} {required} {div} Type of the controller
 *      div: create a div control which content custom html
 *    @param: actions {dict} {optional} list of function with key as function name, these functions will be attached to the controls, and you can call it if you have access to the controls
 *    @param: config {array} {required} configuration for the controls, different for each type
 *      @div_config_params
 *        @params class {string} {optional} class of the div
 *        @params defaultContent {html} {optional} default content of the div control
 *
 *  @param events {array} list of the event for our map
 *    onGeoJsonLayerClicked When user click on the geojson
 *      @param feature {feature data} the geoJson feature that we click on
 *      @param layer {layer object} the layer that we click on
 *      @param event {event} the event object of clicked layer
 *
 *    onMouseOverGeoJsonLayer When the mouse over the layer
 *      @param feature {feature data} the geoJson feature that we move mouse on
 *      @param layer {layer object} the layer that we move mouse on
 *      @param event {event} the event object of moved layer
 *
 *    onGeoJsonLayerClicked When the mouse left the layer
 *      @param feature {feature data} the geoJson feature that we left
 *      @param layer {layer object} the layer that we left
 *      @param event {event} the event object of left layer
 *
 *    onGeoJsonFeatureStateChanged When the feature layer is finished generate
 *      @param feature {feature data} the geoJson feature that we left
 *      @param layer {layer object} the layer that we left
 *      @param data {array} list of geo json data
 *
 *  @ControlAllFunction
 *    getControlById Get the control object with given id
 *      @param id {string} id of the control
 *      @return control {Control | null} control with given id
 *
 *    addMarker Function to add a marker to the map.
 *      @param id  {string} {required} we need this to get the marker later using id. Unique for each map
 *      @param marker  {leaflet marker object} {required}
 *      @param override  {bool} If true, when the id is duplicate, the old marker will be overwrited. Otherwise, return null
 *
 *    addPath Function to add a path to the map.
 *      @param id  {string} {required} we need this to get the path later using id. Unique for each map
 *      @param path  {dict} {required} path configuration
 *      @param override  {bool} If true, when the id is duplicate, the old path will be overwrited. Otherwise, return null
 */
angular.module('open_source.directives.qvLeafletMap', []).directive('qvLeafletMap', ['$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        mapId: '@',
        control: '=',
        center: '=',
        mode: '=',
        maxZoom: '@',
        minZoom: '@',
        geoJson: '=',
        geoJsonStyle: '=',
        geoJsonPopup: '=',
        events: '=',
        mapControls: '=',
        paths: '=',
      },
      templateUrl: 'components/directives/qvLeafletMap/tpl/qvLeafletMap.html',
      replace: true,
      controller: function($scope, $element, leafletData) {
        /* ============================= [INPUT PARAMS] ============================= */
        //default setting of the map
        $scope.defaults = {};
        if($scope.maxZoom){
          $scope.defaults.maxZoom = $scope.maxZoom;
        }
        if($scope.minZoom){
          $scope.defaults.minZoom = $scope.minZoom;
        }
        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [PARAMS] ============================= */
        $scope.mapbox = {
          token: 'pk.eyJ1IjoiZGVtaWdvZCIsImEiOiJjaWhvemg4dWowMGlodDZtNDJsdzRobDV2In0.tObP48Upmdnx36yZu5_TRA',
          id: 'demigod.oalfdin4',
        }

        //contain the geo json data
        $scope.geoJsonData = {
          data: null,
          style: function(feature){
            var styles = $scope.getGeoStyle(feature);
            return styles.default;
          },
          onEachFeature: function(feature, layer){
            return $scope.onGeoJsonFeatureStateChanged(feature, layer);
          }
        };

        //contain the default geo json style(will using this if not config)
        $scope.defaultGeoJsonStyle = {
          'default': {
            fillColor: "green",                     //fill color of the geo object
            weight: 2,                              //weight of its border
            opacity: 1,                             //the transparent of border
            color: 'white',                         //border color
            dashArray: '3',                       //border is dash and length of each dash is 3px
            fillOpacity: 0.7                      //the transparent of object
          },
          'hovered': {                            //when hover
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          },
          'selected': {                           //when selected
            fillColor: "green",
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        };

        //contain the data for each geoJson Layer
        $scope.geoJsonLayersData = {}

        //contain all the controls for this map, key is id
        $scope.controls = {};

        //contain all the marker on the map, key is marker id.
        $scope.markers = {};

        //contain all the paths on the map
        $scope.mapPaths = ($scope.paths)?$scope.paths:{};
        /* ============================= [END PARAMS] ============================= */

        /* ============================= [EVENT] ============================= */
        /**
         * Init function which will call when directive is created
         */
        $scope.init = function(){
          $scope.initControls();
          $scope.getGeoJson();
        }

        /**
         * Events happen when user interact with the map
         */
        $scope.$on('leafletDirectiveMap.click', function(event, args){
          $scope.onMapClick(event, args);
        });

        /**
         * Event when user click on map
         * @param event {event object}
         * @param args {args}
         */
        $scope.onMapClick = function(event, args){
          var clickLocation = args.leafletEvent.latlng;

          console.log(clickLocation);
        }

        /**
         * Event when user have an interaction with geoJson item
         * @param feature {object} The feature object (geoJson object)
         * @param layer {object} layer of that object
         */
        $scope.onGeoJsonFeatureStateChanged = function(feature, layer){
          //store layer object into the geoJson data holder for later use
          if(!$scope.geoJsonLayersData[layer._leaflet_id]){
            $scope.geoJsonLayersData[layer._leaflet_id] = {};
          }
          $scope.geoJsonLayersData[layer._leaflet_id]['layer'] = layer;

          //call the event
          if($scope.events.onGeoJsonFeatureStateChanged){
            $scope.events.onGeoJsonFeatureStateChanged(feature, layer, $scope.geoJsonData.data);
          }

          layer.on({
            mouseover: function(event){
              var layer = event.target;

              var styles = $scope.getGeoStyle(feature);
              layer.setStyle(styles.hovered);

              //attach popup if allow
              if($scope.geoJsonPopup){

                var popupSetting = null;
                var getJsonPopupSetting = $scope.geoJsonPopup(feature, layer);
                if(getJsonPopupSetting.popup){
                  popupSetting = getJsonPopupSetting.popup(feature, layer);
                }

                $scope.addPopupMarkerToLayer(layer, popupSetting, null);
              }

              if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
              }

              //fire events
              if($scope.events && $scope.events.onMouseOverGeoJsonLayer){
                $scope.events.onMouseOverGeoJsonLayer(feature, layer, event);
              }
            },
            mouseout: function(event){
              var layer = event.target;

              var styles = $scope.getGeoStyle(feature);
              layer.setStyle(styles.default);

              //unattach popup if allow
              if($scope.geoJsonPopup){
                $scope.removePopupMarkerFromLayer(layer);
              }

              if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
              }

              //fire events
              if($scope.events && $scope.events.onMouseOutGeoJsonLayer){
                $scope.events.onMouseOutGeoJsonLayer(feature, layer, event);
              }
            },
            click: function(event){
              //fire events
              if($scope.events && $scope.events.onGeoJsonLayerClicked){
                $scope.events.onGeoJsonLayerClicked(feature, layer, event);
              }
            },
          });
        }
        /* ============================= [END EVENT] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * This function will be call when the directive is initialize. It will read the
         * controls setting and generate them
         */
        $scope.initControls = function(){
          //first we clear the holder
          $scope.controls = {};

          if($scope.mapControls && $scope.mapControls.length > 0){
            //wait until the map is generated
            leafletData.getMap().then(function(map) {
              angular.forEach($scope.mapControls, function(control, controlIndex) {
                if(control.id && control.type && control.config){

                  var controlObject = L.control();

                  if(control.type = 'div'){
                    //this is div control, create one
                    controlObject.onAdd = function (map) {
                      this._div = L.DomUtil.create('div', ((control.config.class)?control.config.class:''));

                      if(control.config.defaultContent){
                        this._div.innerHTML = control.config.defaultContent;
                      }

                      return this._div;
                    };
                  }

                  //save the actions
                  angular.forEach(control.actions, function(action, actionName) {
                    controlObject[actionName] = action;
                  });

                  if(controlObject){
                    controlObject.addTo(map);

                    //save to params (to fetch later)
                    $scope.controls[control.id] = controlObject;
                  }
                }
              });
            });
          }
        }

        /**
         * This function will add a popup-type marker to selected layer
         * Popup-type marker will display when mouse hover, and hide when mouse over
         * @param layer {layer object of leaflet map} selected layer
         * @param popupOptions {array} setting for the popup. if not set, we will using default
         * @param markerOptions  {array} configuration of the marker, if not set, we will using default
         */
        $scope.addPopupMarkerToLayer = function(layer, popupOptions, markerOptions){
          if(!layer){
            return;
          }

          //check if layer have this popup marker or not
          if($scope.geoJsonLayersData[layer._leaflet_id] && $scope.geoJsonLayersData[layer._leaflet_id]['popup_marker']){
            //already have marker, ignore it since we only have one popup marker at a time
          }
          else{
            //create new marker and add to the layer
            var popupMarkerOption = null;
            if(popupOptions){
              if(!popupMarkerOption){
                popupMarkerOption = {};
              }
              popupMarkerOption.icon = popupOptions;
            }

            if(markerOptions){
              if(!popupMarkerOption){
                popupMarkerOption = {};
              }
              angular.extend(popupMarkerOption, markerOptions);
            }
            var marker = L.marker(layer.getBounds().getCenter(), popupMarkerOption).addTo(layer);

            if(!$scope.geoJsonLayersData[layer._leaflet_id]){
              $scope.geoJsonLayersData[layer._leaflet_id] = {};
            }
            $scope.geoJsonLayersData[layer._leaflet_id]['popup_marker'] = marker;
          }
        }

        /**
         * Remove the popup-type marker from selected layer
         * @param layer {layer object of leaflet map} selected layer
         */
        $scope.removePopupMarkerFromLayer = function(layer){
          if($scope.geoJsonLayersData[layer._leaflet_id] && $scope.geoJsonLayersData[layer._leaflet_id]['popup_marker']){
            var marker = $scope.geoJsonLayersData[layer._leaflet_id]['popup_marker'];
            if(marker){
              layer.removeLayer(marker);
              $scope.geoJsonLayersData[layer._leaflet_id]['popup_marker'] = null;
            }
          }
        }

        /**
         * Function to get geo json data if set
         */
        $scope.getGeoJson = function(){
          if($scope.geoJson){
            $scope.geoJson(function(geoData){
              //success handler
              $scope.geoJsonData.data = geoData;
            }, function(message){
              //failure handler
            });
          }
        }

        /**
         * Get the geo json style
         */
        $scope.getGeoStyle = function(feature){
          var styles = $scope.defaultGeoJsonStyle;
          if($scope.geoJsonStyle){
            styles = $scope.geoJsonStyle(feature);
          }

          return styles;

        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [OUTPUT FUNCTIONS] ============================= */
        /**
         * Reload the map
         */
        $scope.refresh = function(){
          leafletData.getMap().then(function(map) {
            console.log('reload');
            map._onResize();
          });
        }

        /**
         * Get the control of given id
         * @param id  {string} id of the control
         */
        $scope.getControlById = function(id){
          return $scope.controls[id];
        }

        /**
         * Function to add a marker to the map.
         * @param id  {string} {required} we need this to get the marker later using id. Unique for each map
         * @param marker  {leaflet marker object} {required}
         * @param override  {bool} If true, when the id is duplicate, the old marker will be overwrited. Otherwise, return null
         */
        $scope.addMarker = function(id, marker, override){
          if(!id || !marker){
            return null;
          }

          if($scope.markers[id] && !override){
            console.log('duplicate id, cannot add selected marker');
            return null;
          }

          $scope.markers[id] = marker;
          leafletData.getMap().then(function(map) {
            marker.addTo(map);
          });
        }

        /**
         * Function to add a path to the map.
         * @param id  {string} {required} we need this to get the path later using id. Unique for each map
         * @param path  {dict} {required} Path configuration (http://leafletjs.com/reference.html#path)
         * @param override  {bool} If true, when the id is duplicate, the old path will be overwrited. Otherwise, return null
         */
        $scope.addPath = function(id, path, override){
          if(!id || !path){
            return null;
          }

          if($scope.mapPaths[id] && !override){
            console.log('duplicate id, cannot add selected path');
            return null;
          }

          $scope.mapPaths[id] = path;
        }
        /* ============================= [END OUTPUT FUNCTIONS] ============================= */

        /* ============================= [PRECALL] ============================= */
        $scope.init();

        //set all the output functions
        $scope.control.getControlById = $scope.getControlById;
        $scope.control.addMarker = $scope.addMarker;
        $scope.control.addPath = $scope.addPath;
        $scope.control.refresh = $scope.refresh;
        /* ============================= [END PRECALL] ============================= */
      },
    };
  }
]);
