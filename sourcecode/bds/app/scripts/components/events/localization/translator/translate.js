/**
 * Created by quocviet on 10/31/15.
 */
/**
 * This event handler handle all the events trigger by angular-translator using in our app.
 * Check http://angular-translate.github.io/docs/#/guide/18_events for list of events
 *
 * @Events:
 * translateChangeSuccess: when we finished change the language of our application. We will set the new value into current
 * user session and send it to our server. The server will return the corresponding language with this new language
 */
angular.module('app.events.translate', []).run([
  '$rootScope',
  '$translate',
  function ($rootScope, $translate) {
    $rootScope.$on('$translateChangeSuccess', function () {

    });
  }
]);
