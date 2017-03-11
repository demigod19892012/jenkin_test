/**
 * Created by quocviet on 11/17/15.
 */
angular.module('app.controllers.search')
  .controller('SearchCtrl', [
    '$scope',
    'searchCf',
    '$translate',
    'geoServices',
    'projectGeoStatisticServices',
    'searchServices',
    '$timeout',
    function ($scope, searchCf, $translate, geoServices, projectGeoStatisticServices, searchServices, $timeout) {
      /* ============================= [PARAMS] ============================= */
      //Map configuration
      $scope.map = searchCf.mapCf($scope);

      $scope.distributionData = {};
      //save the feature and layer in key-value format with key is the id
      $scope.mapGeoJsonLayers = {};

      //the place we will display the interest project
      $scope.interestProjectAnchorPoint = [
        {
          lat: 23.1201536216956,
          lng: 97.49267578125
        },
        {
          lat: 18.812717856407776,
          lng: 97.49267578125
        },
        {
          lat: 12.790374787613601,
          lng: 97.49267578125
        },
      ]

      //contain the configuration for search form
      $scope.searchConfig = {
        hideSearchOptions: true,
      }
      /* ============================= [END PARAMS] ============================= */

      /* ============================= [FUNCTION] ============================= */
      /**
       * Redirect to location
       * @param feature {feature} given feature
       * @return color {string color code}
       */
      $scope.redirectToLocation = function(feature){
        if(!feature || !feature.id){
          console.log('Cannot get location data');
          return null;
        }

        searchServices.searchInCity(feature.id);
      }

      /**
       * Function to get geoJson data from server
       * @param successHandler
       * @param failureHandler
       */
      $scope.getGeoJson = function(successHandler, failureHandler){
        //we only get vn data
        geoServices.fetchGeoJson('vn', function(geoJson){
          //when we finish getting the data, we will try getting statistic data
          projectGeoStatisticServices.fetchProjectGeoDistributionData('vn', function(distributions){
            //put all distributions data into our param in key-value state
            angular.forEach(distributions, function(value, key) {
              if(value.key){
                $scope.distributionData[angular.uppercase(value.key)] = value;
              }
            });
            //better having a deplay to wait for the geojson layer to loaded
            $timeout($scope.addInterestProjectIcons, 1000);

            if(successHandler){
              successHandler(geoJson);
            }

          }, function(errorMessage){
            if(failureHandler){
              failureHandler(message);
            }
          });

        }, function(message){
          if(failureHandler){
            failureHandler(message);
          }
        });
      }

      /**
       * Get the geoJson color base on the feature
       * @param feature {feature} given feature
       * @return color {string color code}
       */
      $scope.getGeoJsonColor = function(feature){
        var color = '#FFEDA0';

        if(feature && $scope.distributionData[feature.id]){
          var totalProject = $scope.distributionData[feature.id]['total_project'];
          color = totalProject > 500 ? '#800026' :
                  totalProject > 100  ? '#BD0026' :
                    totalProject > 50  ? '#E31A1C' :
                      totalProject > 10  ? '#FC4E2A' :
                        totalProject > 5   ? '#FD8D3C' :
                          totalProject > 2   ? '#FD8D3C' :
                            totalProject > 0   ? '#FD8D3C' :
                              '#FFEDA0';
        }

        return color;
      }

      /**
       * This function will read data from the statistic data return from server, parse it and display the top project on map as marker
       */
      $scope.addInterestProjectIcons = function(){
        //first we need to get the list of interest project from server response
        var interestDatas = [];

        angular.forEach($scope.distributionData, function(data, cityKey) {
          if(data.most_view_project){
            interestDatas.push({
              project: data.most_view_project,
              cityKey: cityKey
            });
          }
        });

        //we will create marker and add them into the map
        for(var i = 0; i < $scope.interestProjectAnchorPoint.length; i++){
          var anchor = $scope.interestProjectAnchorPoint[i];

          if(i < interestDatas.length){
            var interestData = interestDatas[i];

            var imageUrl = (interestData.project && interestData.project.main_image && interestData.project.main_image.abs_url)?interestData.project.main_image.abs_url:'';
            var htmlInterestData = '<div class="interestImage" style="background: url('+imageUrl+');background-size: 100% 100%;background-repeat: no-repeat;background-position: center center;">' +
              '<span class="interestLabel">' +
                ((interestData.project && interestData.project.name)?interestData.project.name:'')+
              '</span>' +
              '</div>';

            var markerOptions = {
              icon: L.divIcon({
                className: 'interestProjectMarkerDiv',
                html: htmlInterestData,
                iconSize: [266, 181],
                iconAnchor: [133, 90],
              }),
            };

            var marker = L.marker(anchor, markerOptions);

            //register event
            marker.on({
              click: function(event){

              },
              mouseover: function(event){
                //hightlight the layer when the interest marker is hover
                var geoJsonData = $scope.mapGeoJsonLayers[angular.uppercase(interestData.cityKey)];
                if(geoJsonData) {
                  var layer = geoJsonData.layer;
                  var feature = geoJsonData.feature;

                  var styles = $scope.map.geoJsonStyle(feature);
                  layer.setStyle(styles.hovered);

                  if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                  }

                  var geoJsonExtraInforDiv = $scope.map.control.getControlById('city_geojson_extra_info_div');
                  if(geoJsonExtraInforDiv){
                    geoJsonExtraInforDiv.update(feature);
                  }
                }
              },
              mouseout: function(event){
                //return style to default when mouse out
                var geoJsonData = $scope.mapGeoJsonLayers[angular.uppercase(interestData.cityKey)];
                if(geoJsonData) {
                  var layer = geoJsonData.layer;
                  var feature = geoJsonData.feature;

                  var styles = $scope.map.geoJsonStyle(feature);
                  layer.setStyle(styles.default);

                  if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                  }

                  var geoJsonExtraInforDiv = $scope.map.control.getControlById('city_geojson_extra_info_div');
                  if(geoJsonExtraInforDiv){
                    geoJsonExtraInforDiv.reset();
                  }
                }
              }
            });

            if($scope.map.control && $scope.map.control.addMarker){
              $scope.map.control.addMarker('interest_project_marker_' + i ,marker, true);
            }

            //get the layer of the current city to draw path from it to the interest point
            var geoJsonData = $scope.mapGeoJsonLayers[angular.uppercase(interestData.cityKey)];
            if(geoJsonData){
              var layer = geoJsonData.layer;
              if(layer){
                // add the marker , we will add a path between that marker and the feature
                var path = {
                  color: '#3498db',
                  weight: 1,
                  dashArray: '5, 10',
                  latlngs: [ anchor, layer.getBounds().getCenter() ]
                }

                if($scope.map.control && $scope.map.control.addPath){
                  $scope.map.control.addPath('interest_project_path_' + i ,path, true);
                }
              }
            }
          }
        }
      }
      /* ============================= [END FUNCTION] ============================= */
    }
  ]
);
