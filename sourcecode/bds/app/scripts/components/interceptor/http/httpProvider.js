/**
 * Created by quocviet on 10/31/15.
 */
/**
 * This interceptor is triggered before all request to add extra data to header. We only do this for request to our server
 *
 * @Reminder:
 *  Make sure to set Access-Control-Allow-Headers on the server site to allow the following headers:
 *    - Language
 * @Request:
 *  1.Data:
 *    Language: set the current language into request header : Language
 *    Authorization: add the access token to any request require it. Format : Authorization: Bearer {yourtokenhere}
 *
 *
 */
angular.module('app.interceptor.httpProvider', []).factory('httpProviderInterceptor', ['$translate', 'api', 'sessionService', function($translate, api, sessionService) {
  var httpProviderInterceptor = {
    request: function(config) {
      var serverUrl = api.server();

      //we only do this for request to our server
      if(config.url && serverUrl && config.url.indexOf(serverUrl) > -1){
        config.headers['Language'] = $translate.use();

        //if user token is available, add to header
        var currentUser = sessionService.getUserData();
        if(currentUser && currentUser.access_token){
          config.headers['Authorization'] = 'Bearer '+ currentUser.access_token;
        }
      }

      return config;
    }
  };
  return httpProviderInterceptor;
}]);

angular.module('app.interceptor.httpProvider').config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('httpProviderInterceptor');
}]);
