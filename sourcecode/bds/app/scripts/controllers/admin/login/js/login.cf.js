/**
 * Created by quocviet on 10/26/15.
 */
angular.module('app.controllers.admin.signIn')
  .factory('signInCf', function (api, routerService, sessionService, userModel) {
    var configurations = {};

    /**
     * Return the configuration of the login form
     * @param $scope  Main scope pass from controller
     * @returns {data} Configuration data
     */
    configurations.loginFormCf = function($scope) {
      return {
        url: api.url('signIn'),
        events: {
          onLoginSuccess: function(data){
            //save the user state
            sessionService.saveUserData(data.data);

            //save the user to root scope.
            $scope.global.currentUser = new userModel(data.data);

            routerService.toHome();
          }
        }
      };
    };

    return configurations;
  }
);

