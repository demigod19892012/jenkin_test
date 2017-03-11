/**
 * Created by quocviet on 10/28/15.
 */
/**
 * @Requirement:
 * - (required) angular-material library: css and js
 * - (optional) angular-tranlate library
 * - (required) custom css for toast: styles/override/material_toast/_toast.scss
 *
 * @Description
 * Custom the angular material toast, allow to display various type of toast with control and css
 *
 * @Instruction
 * I-Setup
 *  Import file js into index.html
 *  Import qvToast into the project
 * II-Register the theme to your app
 *  Add the folloing into your app config
 *  .config(function($mdThemingProvider) {
 *    //we need to register some theme for ngMaterial
 *    $mdThemingProvider.theme('success-toast');
 *    $mdThemingProvider.theme('error-toast');
 *    $mdThemingProvider.theme('default-toast');
 *  })
 */
angular.module('open_source.services.qvToast', []).factory('qvToast', function($mdToast){
  var service = {};

  var HIDE_DELAY_TIME = 3000;                                    //origin value for default delay

  //type of toast
  var TOAST_TYPE = {
    success: 'success',
    error: 'error',
    default: 'default',
  }
  var defaultHideDelay = HIDE_DELAY_TIME;                                  //if user dont set the hide time, this time will be used instead.

  var POSITION = {
    top_right: 'top right',
    top_left: 'top left',
    bottom_right: 'bottom right',
    bottom_left: 'bottom left',
  }

  //position default of the toast.
  var defaultPosition = POSITION.top_right;

  /**
   * Set the keys for the service
   */
  service.POSITION_TOP_RIGHT = POSITION.top_right;
  service.POSITION_TOP_LEFT = POSITION.top_left;
  service.POSITION_BOTTOM_LEFT = POSITION.bottom_left;
  service.POSITION_BOTTOM_RIGHT = POSITION.bottom_right;

  /**
   * Set the default delay.
   * If the delay value is 0 or less, the system will get the origin value instead
   * @param delay [float] time until disappear
   */
  service.setDefaultDelay = function(delay){
    if(delay && delay > 0){
      defaultHideDelay = delay;
    }
    else{
      defaultHideDelay = HIDE_DELAY_TIME;
    }
  }

  /**
   * Set the toast position.
   * @param delay [float] time until disappear
   */
  service.setDefaultPosition = function(position){
    if(position){
      defaultPosition = position;
    }
    else{
      defaultPosition = service.POSITION_TOP_RIGHT;
    }
  }

  /**
   * Show the toast to display message
   * @param message [string] message to display
   * @param type  [string] type of message (check TOAST_TYPE)
   * @param delay [float] time until hide
   * @param position [string] position of the toast
   */
  service.showToast = function(message, type, delayHide, position){
    var toastType = (type)?type: TOAST_TYPE.default;
    var toastPosition = (position)?position: defaultPosition;
    var toastDelay = (delayHide && delayHide > 0)?delayHide:defaultHideDelay;

    var theme = 'default-toast';
    if(type == TOAST_TYPE.success){
      theme = 'success-toast';
    }
    else if(type == TOAST_TYPE.error){
      theme = 'error-toast';
    }

    if(message){
      var toast = $mdToast.simple().content(message).hideDelay(toastDelay).position(toastPosition).theme(theme);
      $mdToast.show(toast);
    }
  }

  /**
   * Show the default toast
   * @param message [string] message to display
   */
  service.toast = function(message){
    service.showToast(message, TOAST_TYPE.default, defaultHideDelay);
  }

  /**
   * Show the success toast
   * @param message [string] message to display
   */
  service.toastSuccess = function(message){
    service.showToast(message, TOAST_TYPE.success, defaultHideDelay);
  }

  /**
   * Show the error toast
   * @param message [string] message to display
   */
  service.toastError = function(message){
    service.showToast(message, TOAST_TYPE.error, defaultHideDelay);
  }

  return service;
});

