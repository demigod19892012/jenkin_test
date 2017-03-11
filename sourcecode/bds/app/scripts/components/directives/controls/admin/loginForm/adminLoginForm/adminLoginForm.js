/**
 * Created by quocviet on 10/16/15.
 */
/**
 * Directive to create the login form for admin.
 * Requirement:
 * - (required) httpRequest: from component/services/http/httpRequest.js
 * - (required) qvToast: from component/services/notification/toast/qvToast.js
 * - (required) qvForm: from component/directives/control/form
 * - (required) angular-translate library
 * - (optional) angular-material library: css and js
 *
 */
angular.module('app.directives.adminLoginForm', []).directive('adminLoginForm', ['$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        config: '=',
      },
      templateUrl: 'scripts/components/directives/controls/admin/loginForm/adminLoginForm/tpl/loginForm.html',
      replace: true,
      controller: function($scope, qvToast, $translate) {
        /* ============================= [PARAMS] ============================= */

        //hold the data for login form
        $scope.loginForm = {
          name: 'adminLoginForm',

          submit: {
            type: 'POST',
            url: function(){
              var url = ($scope.config && $scope.config.url)?$scope.config.url:null;
              return url;
            },
            extraData: null,
          },

          fields: [
            //only one section, and no title
            {
              name: 'login',
              //3 row
              fields: [
                [
                  {
                    type: 'email',
                    name: 'email',
                    label: 'TRANS_EMAIL_TEXT',
                    events: {
                      onEnter: function(field, directive){
                        if(directive.isFormValid()){
                          //handler for login success
                          directive.submit();
                        }
                      }
                    },
                    validation: {
                      message: 'TRANS_EMAIL_INVALID',
                      validations: [
                        {
                          type: 'required',
                          message: 'TRANS_EMAIL_INVALID_REQUIRE',
                        },
                        {
                          type: 'minlength',
                          value: 5,
                          message: 'TRANS_EMAIL_INVALID_MINLENGTH',
                        },
                        {
                          type: 'maxlength',
                          value: 100,
                          message: 'TRANS_EMAIL_INVALID_MAXLENGTH',
                        },
                        {
                          type: 'pattern',
                          message: 'TRANS_EMAIL_INVALID_FORMAT',
                        }
                      ],
                    }
                  }
                ],
                [
                  {
                    type: 'password',
                    name: 'password',
                    label: 'TRANS_PASSWORD_TEXT',
                    events: {
                      onEnter: function(field, directive){
                        if(directive.isFormValid()){
                          //handler for login success
                          directive.submit();
                        }
                      }
                    },
                    validation: {
                      message: 'TRANS_PASSWORD_INVALID',
                      validations: [
                        {
                          type: 'required',
                          message: 'TRANS_PASSWORD_INVALID_REQUIRE',
                        },
                        {
                          type: 'minlength',
                          value: 5,
                          message: 'TRANS_PASSWORD_INVALID_MINLENGTH',
                        },
                        {
                          type: 'maxlength',
                          value: 30,
                          message: 'TRANS_PASSWORD_INVALID_MAXLENGTH',
                        }
                      ],
                    }
                  }
                ],
                [
                  {
                    type: 'submit',
                    name: 'submit',
                    label: 'TRANS_SIGNIN_TEXT',
                  }
                ],
              ]
            }
          ],

          events:{
            onBeforeSubmit: function(formData){
              return true;
            },
            onAfterSubmit: function(formData, response){
              //check if success or not
              if(response.status != 200){
                var message = null;
                if(response.data && response.data.message){
                  message = response.data.message;
                }
                else{
                  message = $translate.instant('TRANS_LOGIN_FAILURE');
                }

                qvToast.toastError(message);
              }
              else{
                var message = null;

                if(response.data && response.data.message){
                  message = response.data.message;
                }
                else{
                  message = $translate.instant('TRANS_LOGIN_SUCCESS');
                }

                qvToast.toastSuccess(message);

                //handler for login success
                if($scope.config.events && $scope.config.events.onLoginSuccess){
                  $scope.config.events.onLoginSuccess(response.data);
                }
              }
            }
          }
        }

        /* ============================= [END PARAMS] ============================= */

      }
    };
  }
]);
