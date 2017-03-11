/**
 * Created by quocviet on 10/18/15.
 */
/**
 * @Description
 * Directive to work with input from keyboard
 *
 * @Configuration
 * Just include this file into your app
 *
 */
angular.module('open_source.directives.input.qvKeyboard', [])

.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keyup", function (event) {
      if(event.which === 13) {
        scope.$eval(attrs.ngEnter);

        event.preventDefault();
      }
    });
  };
});
