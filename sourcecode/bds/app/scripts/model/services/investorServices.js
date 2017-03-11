/**
 * Created by quocviet on 11/15/15.
 */
/**
 * Helper functions to working with investor
 */
angular.module('app.model.services.investorServices', []).factory('investorServices', function(investorModel, httpRequest, $q, api){
  var service = {};

  /**
   * Get list of investor objects from given data
   * @param data  Json data (from server)
   * @returns {Array} Array of project items
   */
  service.investorsFromData = function(data){
    var investors = [];

    for(var i = 0; i < data.length; i++){
      var investorData = data[i];
      var investor = new investorModel(investorData);

      investors.push(investor);
    }

    return investors;
  }

  /**
   * Get investors from api
   * @param data {array} {optional} Get data we will pass together with the request
   * @param successHandler  {callback} success handler called when the request finished
   * @param failureHandler {callback} failure handler called when the request finished
   */
  service.fetchInvestors = function(data, successHandler, failureHandler){
    var fetchDeferred = $q.defer();
    var fetchRequest = new httpRequest(api.url('fetchInvestors'), data, fetchDeferred.resolve, fetchDeferred.reject, 'GET');

    //handle the callback from api call
    fetchDeferred.promise
      .then(function(data) {
        //if success
        var investors = service.investorsFromData(data.data.data.data);
        var total = data.data.data.total;

        if(successHandler){
          successHandler(investors, total);
        }

      }, function(data) {
        //if failed

        if(failureHandler){
          failureHandler(data.data.message);
        }
      });

    return fetchRequest.request();
  }

  return service;
});
