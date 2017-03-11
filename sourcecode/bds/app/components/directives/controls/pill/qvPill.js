/**
 * Created by quocviet on 11/8/15.
 */
/**
 * @Requirement:
 * - (optional) angular-material library: css and js
 * - (optional) angular-tranlate library
 * - (required) httpRequest from components.services.http.httpRequest
 * - (required) css from styles/controls/_pill.scss
 *
 * @Description
 * The pill control which mostly use to display a stat. Contain an image and a label
 *
 */
angular.module('open_source.directives.qvPill', []).directive('qvPill', [
  function() {
    return {
      restrict: 'E',
      scope: {
        model: '=',                            //the model is the label which will display at the right
        img: '@',                              //the icon url
        src: '@',                              //src is treated similar with src of <a>
        tooltipText: '@',                      //tool tip text. Translate already included so you can pass key or text as you wish,
        tooltipDirection: '@',                 //direction of the tool tip (top, left, right, bottom). Default is bottom
        width: '@',                            //width of the pill, empty mean 100% parent. Example: 100px or 30%
      },
      templateUrl: 'components/directives/controls/pill/tpl/qvPill.html',
      replace: true,
      controller: function($scope, $element, $q, httpRequest) {
        /* ============================= [INPUT PARAMS] ============================= */


        /* ============================= [END INPUT PARAMS] ============================= */

      }
    };
  }
]);
