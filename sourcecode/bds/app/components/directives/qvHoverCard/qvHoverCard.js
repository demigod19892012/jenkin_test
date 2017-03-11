/**
 * Created by quocviet on 11/14/15.
 */
/**
 * Directive to support display a panel (given template) when user put the cursor over an object.
 * The display panel will hover on the screen, at the focus object
 *
 * @Note:
 * If this directive is apply, the applied item's childs wont be able to interactive with anymore. For example, if you have
 * a button inside the element which have this directive, the button will be in-interactable. The element itself is still intact thought
 *
 * @Instruction:
 * 1. Include the directive into the app
 * 2. Include the css into the app. It is located at styles/directives/qvHoverCard
 * 3. Add qv-hover-card directive to target item
 * 4. Select a hook data for qv-hook-data.
 * 5. Send the template url to qv-hover-tpl. Remember, the hook data will be used in the template as hookData. So forexample,
 *  you have qvHookData="myData" with myData = {name:'qv'}, you can display that name in template as hookData.name
 *
 * @Configuration
 *  qvHoverTpl: {string} {required} path to the template
 *  qvHookData: {object} {optional} the hook data will be used in the template
 *  qvPos: {object} {optional} {default: {top: 0, bottom: 1, left: 0, right: 1}}. The relative position of the card
 *    in compare with the hook target. Remember, top and bottom will override eachother (bottom have higher priority), same with left and right
 *
 * @Explaination
 * When the DOM is ready, angular walks the DOM to identify all registered directives and compile the directives one by
 * one based on priority if these directives are on the same element. We set our custom directive's priority to a high
 * number to ensure that it will be compiled first and with terminal: true, the other directives will be skipped after
 * this directive is compiled.
 * When our custom directive is compiled, it will modify the element by adding directives and removing itself and use
 * $compile service to compile all the directives (including those that were skipped).
 * If we don't set terminal:true and priority: 1000, there is a chance that some directives are compiled before our
 * custom directive. And when our custom directive uses $compile to compile the element => compile again the already
 * compiled directives. This will cause unpredictable behavior especially if the directives compiled before our custom
 * directive have already transformed the DOM.
 */
angular.module('open_source.directives.qvHoverCard', []).directive('qvHoverCard', function($compile) {
  return {
    restrict: 'A',
    scope: {
      qvHoverTpl: '@',                        //link to the template
      qvHookData: '=',                        //The data which the template will be hook into.
      qvPos: '=',                             //The position where the card will display
    },
    link: function(scope, $element, $attrs) {
      /* ============================ [COMPILE] ============================ */
      $element.removeAttr("qv-hover-card");

      //first we add an item to the element
      var overlayElement = angular.element('<div style="position: absolute; width: '+$element.width()+'px; height: '+$element.height()+'px"></div>');
      //next we give it event
      overlayElement.attr( "ng-mouseenter", "qvHoverCardMouseEnter()" );
      overlayElement.attr( "ng-mouseleave", "qvHoverCardMouseLeave()" );

      $compile(overlayElement)(scope);
      $element.prepend(overlayElement);

      //next we add the item which will contain the template
      var cardElement = angular.element('<div class="angular-hovercard-detail" ng-class="{ \'angular-hovercard-active\': showCard }" data-ng-include="qvHoverTpl"></div>');

      if (scope.position.bottom) {
        cardElement.css('top', $element.offset().top + $element.height() + 'px');
      }
      if (scope.position.top) {
        cardElement.css('top', $element.offset().top + 'px');
      }
      if (scope.position.left) {
        cardElement.css('left', $element.offset().left + 'px');
      }
      if (scope.position.right) {
        cardElement.css('left', $element.offset().left + $element.width() + 'px');
      }

      $compile(cardElement)(scope);
      $element.append(cardElement);
      /* ============================ [END COMPILE] ============================ */
    },
    controller: function($scope, $element) {
      /* ============================ [PARAMS] ============================ */
      $scope.hookData = $scope.qvHookData;                        //the hook data pass from outsite
      $scope.position = ($scope.qvPos)?$scope.qvPos: {
        top: 1,
        bottom: 0,
        left: 0,
        right: 1
      };                                                          //default is bottom right
      $scope.showCard = false;                                    //flag to decide if the card is visible or not
      /* ============================ [END PARAMS] ============================ */

      /* ============================ [EVENT] ============================ */
      /**
       * Event when user mouse enter the item range
       */
      $scope.qvHoverCardMouseEnter = function(){
        if(!$scope.qvHoverTpl){
          return;
        }

        //when we hover the item, we need to decide the position to display the panel
        var cardElement = $($element).find('.angular-hovercard-detail');
        if(cardElement){
          var cardAngularElement = angular.element(cardElement);

          if ($scope.position.bottom) {
            cardAngularElement.css('top', $element.offset().top + $element.height() + 'px');
          }
          if ($scope.position.top) {
            cardAngularElement.css('top', $element.offset().top + 'px');
          }
          if ($scope.position.left) {
            cardAngularElement.css('left', $element.offset().left - cardAngularElement.width() + 'px');
          }
          if ($scope.position.right) {
            cardAngularElement.css('left', $element.offset().left + $element.width() + 'px');
          }
        }

        $scope.showCard = true;
      }

      /**
       * Event when user mouse leave the item range
       */
      $scope.qvHoverCardMouseLeave = function(){
        if(!$scope.qvHoverTpl){
          return;
        }

        $scope.showCard = false;
      }
      /* ============================ [END EVENT] ============================ */
    }
  }
});
