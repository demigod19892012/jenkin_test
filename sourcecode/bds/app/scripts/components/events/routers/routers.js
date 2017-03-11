angular.module('app.events.routers', []).run([
  '$rootScope',
  'templateService',
  'appStateService', function ($rootScope, templateService, appStateService) {
    $rootScope.$on('$routeChangeStart', function (event, currRoute, prevRoute) {
      //set the template for the app body
      templateService.setMainTemplate(currRoute.templateMain);

      //set the app state
      appStateService.informRouterChangeStateToLoading();
    });

    $rootScope.$on('$routeChangeSuccess', function(){
      //set the app state
      appStateService.informRouterChangeStateToSuccess();
    });
}]);
