/**
 * Created by quocviet on 11/15/15.
 */
/**
 * Helper functions to working with project
 */
angular.module('app.model.services.projectServices', []).factory('projectServices', function(projectModel, httpRequest, $q, api){
  var service = {};

  /**
   * Get list of project objects from given data
   * @param data  Json data (from server)
   * @returns {Array} Array of project items
   */
  service.projectsFromData = function(data){
    var projects = [];

    for(var i = 0; i < data.length; i++){
      var projectData = data[i];
      var project = new projectModel(projectData);

      projects.push(project);
    }

    return projects;
  }

  /**
   * Get projects from api
   * @param data {array} {optional} Get data we will pass together with the request
   * @param successHandler  {callback} success handler called when the request finished
   * @param failureHandler {callback} failure handler called when the request finished
   */
  service.fetchProjects = function(data, successHandler, failureHandler){
    var fetchDeferred = $q.defer();
    var fetchRequest = new httpRequest(api.url('fetchProjects'), data, fetchDeferred.resolve, fetchDeferred.reject, 'GET');

    //handle the callback from api call
    fetchDeferred.promise
      .then(function(data) {
        //if success
        var projects = service.projectsFromData(data.data.data.data);
        var total = data.data.data.total;

        if(successHandler){
          successHandler(projects, total);
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
