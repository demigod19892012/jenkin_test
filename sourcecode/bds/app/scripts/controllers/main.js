'use strict';

/**
 * @ngdoc function
 * @name bdsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bdsApp
 */
angular.module('app.main',[]).controller('MainCtrl', [
    '$scope',
    'templateService',
    'appStateService',
    'api',
    '$mdDialog',
    'sessionService',
    'userModel',
    'qvToast',
    '$translate',
    function ($scope, templateService, appStateService, api, $mdDialog, sessionService, userModel, qvToast, $translate) {
      /* ============================= [PRECALL] ============================= */
      /**
       * Set the root domain for the api url
       */
      api.setServer('http://api.bds.localsite')
      /* ============================= [END PRECALL] ============================= */

      /* ============================= [PARAMETER] ============================= */
      /**
       * Keep the global variable
       */
      $scope.global = {
        app: {
          name: 'SmartBDS',
          /**
           * Is the angular main view ready (is route finish loading)?
           * @returns {boolean}
           */
          isViewReady : function(){
            return appStateService.isRouterSuccessLoaded();
          },
        },
        currentUser: (sessionService.getUserData())?(new userModel(sessionService.getUserData())):null,
      };
      /* ============================= [END PARAMETER] ============================= */

      /* ============================= [FUNCTION] ============================= */
      /**
       * Get the page template (from router)
       * @return: string path to the template
       */
      $scope.getPageTemplate = function(){
        return templateService.mainTemplate();
      };

      /**
       * Logout from current session
       */
      $scope.onLogOut = function($event){
        if($scope.global.currentUser){

          var confirm = $mdDialog.confirm()
            .title($translate.instant('TRANS_LOGOUT_CONFIRM'))
            .content($translate.instant('TRANS_LOGOUT_CONFIRM_EXPLAIN'))
            .ariaLabel('Lucky day')
            .targetEvent($event)
            .ok($translate.instant('TRANS_LOGOUT'))
            .cancel($translate.instant('TRANS_NOT_NOW'));

          $mdDialog.show(confirm).then(function() {
            $scope.global.currentUser.logOut(function(data, status, headers, config){
              if(data.data){
                $scope.global.currentUser = null;
                qvToast.toastSuccess($translate.instant('TRANS_LOGOUT_SUCCESS'));
              }
            }, function(){});
          }, function() {}
          );
        }
      }
      /* ============================= [END FUNCTION] ============================= */
    }
    ]
);
