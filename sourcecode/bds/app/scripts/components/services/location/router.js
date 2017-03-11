/**
 * Created by quocviet on 11/1/15.
 */
/**
 * Service to working with router in the app.
 */
angular.module('app.router', []).factory('routerService', function($location){

  var defaultPath = '/';										        //default page to be redirect to
  var defaultErrorPath = '/500';										//default error path when status isn't set

  return	{
    /**
     * Redirect user to homepage
     */
    toHome:	function(){
      $location.path(defaultPath);
    },

    /**
     * Redirect user to error page
     * @param status [int] The http error code (follow the standard)
     * @param keepHistory [bool] Will we keep the error code in the browser history?
     */
    toError:	function(status, keepHistory){
      var path = defaultErrorPath;

      if(status == 500){
        path = '/500';
      }
      else if(status == 403){
        path = '/403';
      }
      else if(status == 404){
        path = '/404';
      }
      else if(status == 400){
        path = '/400';
      }

      if(keepHistory){
        $location.path(defaultErrorPath);
      }
      else{
        $location.path(defaultErrorPath).replace();
      }
    },

    /**
     * Set the default page
     * @param path [string] path to default
     */
    setDefaultPage: function(path){
      defaultPath = path;
    },

    /**
     * Set the default error page
     * @param path [string] path to default
     */
    setDefaultErrorPage: function(path){
      defaultErrorPath = path;
    },
  }
});

