/**
 * Session service will help you deal with fetch/save data from user session
 * @Note:
 *  User session is save in browser storage
 */
angular.module('app.session.user', []).factory('sessionService', ['$window', function ($window) {
  var session = {};

  session.currentUser = null;

  /**
   * Save user data into session in json format
   * @param data [array] contain user data.
   */
  session.saveUserData =	function(data){
    if(data){
      $window.localStorage.userData = angular.toJson(data);

      session.currentUser = data;
    }
  };

  /**
   * Fetch the user data from storage (in json format), convert it into object and return.
   * The user data will be save into session object.
   * @returns {*}
   */
  session.getUserData = function(){
    try {
      //if we cannot get the current user data, get it from session.
      if(!session.currentUser){
        var data = angular.fromJson($window.localStorage.userData);
        session.currentUser = data;
      }
      return session.currentUser;
    }
    catch (e) {
      console.log("did not receive a valid Json: " + e);
      return null;
    }
  };

  /**
   * Delete user data in browser
   */
  session.removeUserData = function(){
    delete $window.localStorage.userData;

    session.currentUser = null;
  };

  return session;
}]);
