/**
 * Created by quocviet on 12/18/15.
 */
/**
 *
 * @Requirement:
 * - (optional) angular-material library: css and js
 * - (optional) angular-translate library
 *
 * @Description
 * The extension of angular-material select control. Which allow user to pass remote data as well as static data
 *
 * @Configuration
 *  @param model {object} {required} the model (2 binding) which will contain the result
 *  @param class {string} {optional} class attribute of the select box
 *  @param labelKey {string} {required} name of the attribute of the option we will use as label
 *  @param placeholder {string} {optional} text display when nothing is selected. Keep in mind that this already cover by translate filter
 *  @param onSelect {function} {optional} event when user select an item from the list (happen before the model changed)
 *   @onSelect_param: item {object} the selected object, null if nothing is selected
 *  @param onSelectd {function} {optional} event when user select an item from the list (happen after the model changed)
 *   @onSelect_param: item {object} the selected object, null if nothing is selected
 *  @param items {callback function} {required} callback function which will give this directive items list
 *   @item_params:
 *      successHandler {function} The directive will get items via this function.
 *         @successHandler_params:
 *            items {array} List of item pass from the handler
 *            total {int} Actual total number of item
 *      failureHandler {function} The directive will display error message from this handler. If nothing return, list
 *       will simply be empty
 *        @failureHandler_params: message {string} Reason why failure
 *  @param control {dict} Hold the public function for this directive (Check Public function sections below)
 *
 * @PublicFunctions
 *  Public functions will be passed into control object.
 *  @reload force reload the select items
 */
angular.module('open_source.directives.qvSelect', []).directive('qvSelect', [
  function() {
    return {
      restrict: 'E',
      scope: {
        model: '=',                            //the model
        class: '@',                            //class if you want to set style
        placeholder: '@',                      //Place holder text
        items: '=',                            //the callback function which will pass items into this selector
        onSelect: '=',                         //call before the model changed
        onSelected: '=',                       //call after the model changed
        control: '=',                          //hold the control for this directive
        labelKey: '=',                         //name of the attribute of the option we will use as label
      },
      templateUrl: 'components/directives/controls/qvSelect/tpl/qvSelect.html',
      replace: true,
      controller: function($scope, $element, $timeout) {
        /* ============================= [INPUT PARAMS] ============================= */
        $scope.options = [];
        $scope.needReload = true;            //flag to check if we want to reload item or not
        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [EVENT] ============================= */
        /**
         * Init function which will call when directive is created
         */
        $scope.init = function(){

        }

        /**
         * Event when an item is selected
         * @param item {object} selected item
         */
        $scope.onItemSelecte = function(){
          if($scope.onSelect){
            $scope.onSelect($scope.model);
          }
        }

        /**
         * Event when an item is selected
         * @param item {object} selected item
         */
        $scope.onItemSelected = function(){
          if($scope.onSelected){
            $scope.onSelected($scope.model);
          }
        }

        /**
         * When model value changed
         */
        $scope.$watch('model', function(newValue, oldValue) {
          $scope.onItemSelected();
        }, true);
        /* ============================= [END EVENT] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * Function to load item into selector. THis function can only work if items params in scope is set
         */
        $scope.loadItems = function(){
          if(!$scope.items || !$scope.needReload){
            return;
          }

          //call the handler
          return $scope.items(function(items, total){
            //success case
            $scope.options = items;

            //we loaded the items, no need to do it next time
            $scope.needReload = false;
          }, function(errorMessage){

          });
        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [OUTPUT FUNCTIONS] ============================= */
        /**
         * This function will reload the list with new set of items
         * @param items {array} new configuration for items
         */
        $scope.reload = function(){
          $scope.needReload = true;
        }
        /* ============================= [END OUTPUT FUNCTIONS] ============================= */

        /* ============================= [PRECALL] ============================= */
        $scope.init();

        //set all the output functions
        $scope.control.reload = $scope.reload;
        /* ============================= [END PRECALL] ============================= */
      }
    };
  }
]);
