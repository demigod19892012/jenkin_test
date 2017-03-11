/**
 * Created by quocviet on 11/25/15.
 */
/**
 * Helper functions to working with geo model on our system
 */
angular.module('app.model.services.geoServices', []).factory('geoServices', function(httpRequest, $q, api, addressComponentModel, constants, $translate){
  var service = {};

  /**
   * Get list of geo component objects from given data
   * @param data  Json data (from server)
   * @returns {Array} Array of project items
   */
  service.addressComponentFromData = function(data){
    var components = [];

    for(var i = 0; i < data.length; i++){
      var componentData = data[i];
      var component = new addressComponentModel(componentData);

      components.push(component);
    }

    return components;
  }

  /**
   * Get list of city from a country (or all over the world)
   * @param requestData {array} {optional} array of data we will pass as Get request params
   * @param type {string} {required} {city | locality | route | country} which type of component we want?
   * @param successHandler  {callback} success handler called when the request finished
   * @param failureHandler {callback} failure handler called when the request finished
   */
  service.fetchAddressComponents = function(requestData, type, successHandler, failureHandler){
    var fetchDeferred = $q.defer();

    var url = api.url('geoFetchCities');
    if(type == constants.geo.component.type.locality){
      url = api.url('geoFetchLocalities');
    }
    else if(type == constants.geo.component.type.area){
      url = api.url('geoFetchAreas');
    }
    else if(type == constants.geo.component.type.route){
      url = api.url('geoFetchRoutes');
    }

    var fetchRequest = new httpRequest(url, requestData, fetchDeferred.resolve, fetchDeferred.reject, 'GET');

    //handle the callback from api call
    fetchDeferred.promise
      .then(function(data) {
        //if success
        var components = service.addressComponentFromData(data.data.data.data);
        var total = data.data.data.total;

        if(successHandler){
          successHandler(components, total);
        }

      }, function(data) {
        //if failed

        if(failureHandler){
          failureHandler(data.data.message);
        }
      });

    fetchRequest.request();
  }

  /**
   * Function to fetch the geoJson data from server
   * @param countryCode {string} code of the country
   * @param successHandler  {callback} success handler
   * @param failureHandler {callback} failure handler called when the request finished
   */
  service.fetchGeoJson = function(countryCode, successHandler, failureHandler){
    var fetchDeferred = $q.defer();

    var url = api.url('geoJson');

    var fetchRequest = new httpRequest(url, {country: countryCode}, fetchDeferred.resolve, fetchDeferred.reject, 'GET');

    //handle the callback from api call
    fetchDeferred.promise
      .then(function(geoJson) {
        //if success
        if(successHandler){
          successHandler(geoJson.data);
        }

      }, function(data) {
        //if failed

        if(failureHandler){
          failureHandler($translate.instant('TRANS_GEO_JSON_FAIL'));
        }
      });

    fetchRequest.request();
  }

  return service;
});
