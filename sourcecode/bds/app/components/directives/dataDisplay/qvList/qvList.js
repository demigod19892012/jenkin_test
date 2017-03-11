/**
 * Created by quocviet on 11/11/15.
 */
/**
 * @Requirement:
 * - (optional) angular-material library: css and js
 * - (optional) angular-tranlate library
 *
 * @Description
 * Directive to quickly setup a list to display data. List size base on the container which hold it.
 * List item template will be passed into the directive by user via template url. (think of it as tableview in ios and
 * android)
 *
 * @Configuration
 * I-Setup params
 *  Make sure to setup the following data
 *   1.Path to template: (in directive templateUrl)
 *   2.Include the css for the qvList. The css file is locate at styles/directive/qvList
 *
 * II-Input params
 *  1.model {array} {two way}
 *    The model held all the list items. Please remember that we have two case of model
 *      Case 1: Offline mode. In this mode, data of the list come directly from model, so the list will use the data inside model and display it
 *        using template. Any change on model will effect the list
 *      Case 2: Online Mode. In this mode, data of the list is fetch from the handler set in configuration, after the handler
 *        is done, the model will be set with the data return from handler. For example, after contact api, we get list of user,
 *        model will now contain that user list.
 *  2.config {dict}
 *    {
 *      name {string} {optional} name of the list, will be use as id for the list
 *      class {string} {optional} the class name for the list. Recommend using this if you want to apply css to item.
 *        Default set to null
 *      items {function} {optional} If not set, list will using model as data source.
 *        @item_params:
 *          successHandler {function} The directive will get items via this function.
 *            @successHandler_params:
 *              items {array} List of item pass from the handler
 *              total {int} Actual total number of item
 *          failureHandler {function} The directive will display error message from this handler. If nothing return, list
 *            will simply be empty
 *            @failureHandler_params: message {string} Reason why failure
 *      itemTemplateUrl {string} {optional} Path to the template file. If not set, we will simply display the item as string instead
 *      messages {array} Contain all neccessary message for the list
 *      {
 *        empty: {string} message when the list is empty
 *      }
 *    }
 */
angular.module('open_source.directives.qvList', []).directive('qvList', [
  function() {
    return {
      restrict: 'E',
      scope: {
        config: '=',                            //contain the configuration data which will generate the directive
        model: '=',                             //the model will held all the list item.
      },
      templateUrl: 'components/directives/dataDisplay/qvList/tpl/qvList.html',
      replace: true,
      controller: function ($scope) {
        /* ============================= [INPUT PARAMS] ============================= */
        //if model is not set, we will create a inner scope data to work with
        $scope.listModel = ($scope.model)?$scope.model:[];
        $scope.total = $scope.listModel.length;

        $scope.listConfig = {
          name: ($scope.config.name)?$scope.config.name:null,
          class: ($scope.config.class)?$scope.config.class:null,
          items: ($scope.config.items)?$scope.config.items:null,
          itemTemplateUrl: ($scope.config.itemTemplateUrl)?$scope.config.itemTemplateUrl:null,
          messages: {
            empty: ($scope.config.messages && $scope.config.messages.empty)?$scope.config.messages.empty:'There is no item to display.',
          }
        }
        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [PARAMS] ============================= */
        $scope.state = {
          error: false,                                 //if true, will display the error item
          errorMessage: null,
          isLoading: false,                             //if true, meaning the data is currently loading from somewhere, so dont display empty message
        }
        /* ============================= [END PARAMS] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * Load the items from configuration handler to the model
         */
        $scope.loadItems = function(){
          //only using this function if items is set
          if(!$scope.listConfig.items){
            return;
          }

          //refresh data
          $scope.state.error = false;
          $scope.state.errorMessage = null;
          $scope.state.isLoading = true;

          //call the handler
          $scope.listConfig.items(function(items, total){
            //success case
            $scope.listModel = items;
            $scope.total = total;

            $scope.state.isLoading = false;
          }, function(errorMessage){
            //failure case
            $scope.state.error = true;
            $scope.state.errorMessage = errorMessage;

            $scope.state.isLoading = false;
          });
        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [PRECALL] ============================= */
        $scope.loadItems();
        /* ============================= [END PRECALL] ============================= */
      }
    }
  }]
);
