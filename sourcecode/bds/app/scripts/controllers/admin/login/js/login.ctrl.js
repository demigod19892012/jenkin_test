angular.module('app.controllers.admin.signIn')
  .controller('AdminLoginCtrl', [
    '$scope',
    'signInCf',
    '$translate',
    function ($scope, signInCf, $translate) {
      /* ============================= [PARAMS] ============================= */
      $scope.loginFormConfig = signInCf.loginFormCf($scope);
      /* ============================= [END PARAMS] ============================= */

      /* ============================= [FUNCTION] ============================= */
      /* ============================= [END FUNCTION] ============================= */
    }
  ]
);
