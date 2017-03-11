/**
 * Created by quocviet on 12/8/15.
 */
/**
 * Helper functions to working with project geo statistic data
 */
angular.module('app.model.services.projectGeoStatisticServices', []).factory('projectGeoStatisticServices', function(projectModel, httpRequest, $q, api){
  var service = {};

  /**
   * Get the project geo distribution data
   * @param countryCode {string|null} {optional} country we want to get distribution data
   * @param successHandler  {callback} success handler called when the request finished
   * @param failureHandler {callback} failure handler called when the request finished
   */
  service.fetchProjectGeoDistributionData = function(countryCode, successHandler, failureHandler){
    var fetchDeferred = $q.defer();

    var url = api.url('projectGeoDistributionData');

    var requestData = {};
    if(countryCode){
      requestData.country = countryCode;
    }

    var fetchRequest = new httpRequest(url, requestData, fetchDeferred.resolve, fetchDeferred.reject, 'GET');

    //handle the callback from api call
    fetchDeferred.promise
      .then(function(data) {
        //if success
        var distributions = data.data.data;

        //read the distribution data and convert project data into object
        for(var i = 0; i < distributions.length; i++){
          var distributionData = distributions[i];
          if(distributionData && distributionData.most_view_project){
            var project = new projectModel(distributionData.most_view_project);
            distributions[i]['most_view_project'] = project;
          }
        }

        if(successHandler){
          successHandler(distributions);
        }

      }, function(data) {
        //if failed
        if(failureHandler){
          failureHandler(data.data.message);
        }
      });

    fetchRequest.request();
  }

  return service;
});
