/**
 * Created by quocviet on 11/25/15.
 */
/**
 *
 * @Requirement:
 * - (optional) angular-material library: css and js
 * - (optional) angular-tranlate library
 * - (required) isteven-multi-select from http://isteven.github.io/angular-multi-select (and a small modification below)
 * - (required) css from styles/override/isteven-multi-select
 *
 * @Description
 * The expanation of the isteven-multi-select library, which support remote loader
 *
 * @Configuration
 * @param model {object} {required} the model (2 binding) which will contain the result
 * @param items {callback function} {required} callback function which will give this directive items list
 *  @item_params:
 *     successHandler {function} The directive will get items via this function.
 *        @successHandler_params:
 *            items {array} List of item pass from the handler
 *            total {int} Actual total number of item
 *     failureHandler {function} The directive will display error message from this handler. If nothing return, list
 *      will simply be empty
 *        @failureHandler_params: message {string} Reason why failure
 * @param buttonLabel {string} {required} Which property will be used to display in the selector text
 * @param itemLabel {string} {required} Which property will be used to display in the item label
 * @param searchProperty {string} {optional} Which property will be used when search
 * @param tickProperty {string} {optional} input-model property with a boolean value that represents whether a checkbox is ticked or not.
 * @param translation {array} {optional} Translate text for all label in control, remember that all label have to be seted, if one is left, it is treated as empty
 *
 * @Modification
 *  @isteven
 *    Since the lib dont support the two way binding for text, we need to add the following at line 981
 *     $scope.$watch( 'translation' , function( newVal ) {
        if ( newVal ) {
          if ( typeof attrs.translation !== 'undefined' ) {
            $scope.lang.selectAll       = $sce.trustAsHtml( $scope.icon.selectAll  + '&nbsp;&nbsp;' + $scope.translation.selectAll );
            $scope.lang.selectNone      = $sce.trustAsHtml( $scope.icon.selectNone + '&nbsp;&nbsp;' + $scope.translation.selectNone );
            $scope.lang.reset           = $sce.trustAsHtml( $scope.icon.reset      + '&nbsp;&nbsp;' + $scope.translation.reset );
            $scope.lang.search          = $scope.translation.search;
            $scope.lang.nothingSelected = $sce.trustAsHtml( $scope.translation.nothingSelected );
          }
          else {
            $scope.lang.selectAll       = $sce.trustAsHtml( $scope.icon.selectAll  + '&nbsp;&nbsp;Select All' );
            $scope.lang.selectNone      = $sce.trustAsHtml( $scope.icon.selectNone + '&nbsp;&nbsp;Select None' );
            $scope.lang.reset           = $sce.trustAsHtml( $scope.icon.reset      + '&nbsp;&nbsp;Reset' );
            $scope.lang.search          = 'Search...';
            $scope.lang.nothingSelected = 'None Selected';
          }
        }
      }, true );
 */
angular.module('open_source.directives.qvMultiSelect', []).directive('qvMultiSelect', [
  function() {
    return {
      restrict: 'E',
      scope: {
        model: '=',                            //the model
        items: '=',                            //the callback function which will pass items into this selector
        buttonLabel: '@',
        itemLabel: '@',
        searchProperty: '@',
        tickProperty: '@',
        translation: '=',
        onItemClick: '=',
        control: '=',
      },
      templateUrl: 'components/directives/controls/multiSelect/tpl/qvMultiSelect.html',
      replace: true,
      controller: function($scope, $element, $q, httpRequest) {
        /* ============================= [INPUT PARAMS] ============================= */
        $scope.options = [];
        $scope.isLoading = false;                             //if this control is loading, we wont allow user to edit it, and the item will become message
        $scope.loader = {
          isLoading: false,
          loadingText: 'Loading...',
        }

        $scope.defaultTranslation = {          //hold the translation text
          selectAll       : "Select All",
          selectNone      : "Select None",
          reset           : "Reset",
          search          : "Search",
          nothingSelected : "Nothing is selected"
        };

        $scope.textTranslation = ($scope.translation)?angular.copy($scope.translation):angular.copy($scope.defaultTranslation);

        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [EVENT] ============================= */
        /**
         * Init function which will call when directive is created
         */
        $scope.init = function(){
          $scope.loadItems();
        }

        /**
         * Event when an item is selected
         * @param data
         */
        $scope.onItemSelected = function(data){
          if($scope.onItemClick && data){
            $scope.onItemClick(data);
          }
        }
        /* ============================= [END EVENT] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * Change the state of loading.
         * In loading state, the list will display the loading item.
         * @param isLoading {bool} loading state
         */
        $scope.setLoading = function(isLoading){
          $scope.loader.isLoading = isLoading;
          if($scope.loader.isLoading){
            //Change the text
            $scope.textTranslation.nothingSelected = $scope.loader.loadingText;
          }
          else{
            //Revert the text
            $scope.textTranslation.nothingSelected = ($scope.translation && $scope.translation.nothingSelected)?$scope.translation.nothingSelected:$scope.defaultTranslation.nothingSelected;
          }
        }

        /**
         * Function to load item into selector. THis function can only work if items params in scope is set
         */
        $scope.loadItems = function(){
          if(!$scope.items){
            return;
          }

          //call the handler
          $scope.setLoading(true);
          $scope.items(function(items, total){
            $scope.setLoading(false);

            //success case
            $scope.options = items;
          }, function(errorMessage){
            $scope.setLoading(false);
          });
        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [OUTPUT FUNCTIONS] ============================= */
        /**
         * This function will reload the list with new set of items
         * @param items {array} new configuration for items
         */
        $scope.reload = function(){
          $scope.loadItems();
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
