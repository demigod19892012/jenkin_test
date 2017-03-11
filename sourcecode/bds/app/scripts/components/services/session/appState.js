angular.module('app.appState', []).factory('appStateService', [function () {
  var state = {};

  var router = {
    changeState : null,                               //get the current state of the router. Include: null, 'loading', 'success', 'failed'
  }

  /**
   * Set the router change state to loading
   * @returns {string}
   */
  state.informRouterChangeStateToLoading = function(){
    return router.changeState = 'loading';
  }

  /**
   * Set the router change state to success
   * @returns {string}
   */
  state.informRouterChangeStateToSuccess = function(){
    return router.changeState = 'success';
  }

  /**
   * Check if the router finish loading and success
   * @returns {boolean}
   */
  state.isRouterSuccessLoaded = function(){
    return (router.changeState == 'success');
  }

  return state;
}]);
