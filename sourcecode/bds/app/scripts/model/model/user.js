/**
 * Created by quocviet on 11/3/15.
 */
/**
 * The object represent the user model on the server side.
 */
angular.module('app.model.user', []).factory('userModel', function(constants, httpRequest, sessionService, api, $q){
  var userModel = function(data) {
    var thisModel = this;											//hold an object which is actually this service

    //set defaults properties and functions
    angular.extend(this, {
      /* ---------- properties ---------- */
      id: (data && data.id)?data.id:null,
      email: (data && data.email)?data.email:null,
      name: (data && data.name)?data.name:null,
      access_token: (data && data.access_token)?data.access_token:null,
      active_status: (data && data.active_status)?data.active_status:2,                       //default is active
      is_root: (data && data.is_root)?data.is_root:0,
      deleted_at: (data && data.deleted_at)?data.deleted_at:null,
      updated_at: (data && data.updated_at)?data.updated_at:null,
      created_at: (data && data.created_at)?data.created_at:null,
      authority: (data && data.authority)?data.authority:1,                                   //default is normal user

      /* ---------- functions ---------- */
      /**
       * Is this user active or not?
       * @returns {boolean}
       */
      isActive: function(){
        return (parseInt(this.active_status) == constants.status.active);
      },

      /**
       * reload the user data with given data
       * @param data {dictionary} array of data which match user properties. If property is missing, the system will
       * treat it as null
       */
      reloadWithData: function(data){
        angular.forEach(thisModel, function(value, key) {
          //we wont touch the functions
          if (typeof thisModel[key] !== "function") {
            //do not check for !data[key] since we want to get 0 and null too
            if(data.hasOwnProperty(key)){
              thisModel[key] = data[key];
            }
            else{
              thisModel[key] = null;
            }
          }
        });
      },

      /**
       * Logout from current Session
       * @param successHandler  Handler if successfully logout
       * @param failureHandler Handler if failed to logout
       */
      logOut: function(successHandler, failureHandler){
        var userData = sessionService.getUserData();
        //only do this if user is the current user
        if(userData.id == this.id){
          //begin logout
          var url = api.url('signOut');
          var params = {};
          var callbackDefer = $q.defer();

          var logoutRequest = new httpRequest(url, params, callbackDefer.resolve, callbackDefer.reject);

          //handle the callback from api call
          callbackDefer.promise
            .then(function(data) {
              //if success, remove from session
              sessionService.removeUserData();

              if(successHandler){
                successHandler(data.data, data.status, data.headers, data.config);
              }
            }, function(data) {
              //if failed
              if(failureHandler){
                failureHandler(data.data, data.status, data.headers, data.config);
              }
            });

          logoutRequest.request();
        }
      }
    });
  };

  return userModel;
});
