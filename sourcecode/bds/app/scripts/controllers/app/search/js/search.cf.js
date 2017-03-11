/**
 * Created by quocviet on 12/16/15.
 */
angular.module('app.controllers.search')
  .factory('searchCf', function ($translate) {
    var configurations = {};

    /**
     * Return the configuration of the main map on first page
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
        maxZoom: 7,
        minZoom: 6,
        geoJson: function(successHandler, failureHandler){
          $scope.getGeoJson(successHandler, failureHandler);
        },
        geoJsonStyle: function(feature){
          return {
            'default':{
              fillColor: $scope.getGeoJsonColor(feature),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            },
            'hovered':{
              fillColor: $scope.getGeoJsonColor(feature),
              weight: 5,
              opacity: 1,
              color: '#ff6545',
              dashArray: '3',
              fillOpacity: 0.7
            },
            'selected':{
              fillColor: $scope.getGeoJsonColor(feature),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }
          };
        },
        geoJsonPopup: function(feature, layer){
          return {
            content: 'Hello',
            popup: function(popupFeature, popupLayer){
              return L.divIcon({
                className: 'geo_json_popup_marker_icon',
                html: popupFeature.properties.NAME,
                iconSize: [100, 20],
                iconAnchor: [50, 45],
              });
            }
          };
        },
        mapControls: [
          {
            id: 'city_geojson_extra_info_div',
            type: 'div',
            config: {
              class: 'search_map_geo_json_detail_div',
              defaultContent: "<h4>" + $translate.instant('TRANS_VN_PROJECT_DENSITY') + "</h4>",
            },
            actions: {
              'update': function(feature){
                var htmlText = "<h4>" + $translate.instant('TRANS_VN_PROJECT_DENSITY') + "</h4>" +
                  '<b>' + feature.properties.NAME + '</b><br />';

                if(feature && $scope.distributionData[feature.id]){
                  var totalProject = $scope.distributionData[feature.id]['total_project'];
                  if(!totalProject){
                    totalProject = 0;
                  }

                  htmlText += $translate.instant('TRANS_VN_PROJECT_DENSITY_TOTAL_PROJECT', {'total' : totalProject});
                }

                this._div.innerHTML = htmlText;
              },
              'reset': function(){
                this._div.innerHTML = "<h4>" + $translate.instant('TRANS_VN_PROJECT_DENSITY') + "</h4>";
              },
            }
          }
        ],
        events: {
          onGeoJsonLayerClicked: function(feature, layer, event){
            $scope.redirectToLocation(feature);
          },
          onMouseOverGeoJsonLayer: function(feature, layer, event){
            var geoJsonExtraInforDiv = $scope.map.control.getControlById('city_geojson_extra_info_div');
            if(geoJsonExtraInforDiv){
              geoJsonExtraInforDiv.update(feature);
            }
          },
          onMouseOutGeoJsonLayer: function(feature, layer, event){
            var geoJsonExtraInforDiv = $scope.map.control.getControlById('city_geojson_extra_info_div');
            if(geoJsonExtraInforDiv){
              geoJsonExtraInforDiv.reset();
            }
          },
          onGeoJsonFeatureStateChanged: function(feature, layer, geoJson){
            //save the layer and feature into an array
            $scope.mapGeoJsonLayers[feature.id] = {
              feature: feature,
              layer: layer,
            }
          }
        }
      };
    };

    return configurations;
  }
);
