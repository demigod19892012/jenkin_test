/**
 * Created by quocviet on 10/29/15.
 */
/**
 * Configuration the multi language in the application
 *
 * @Requirement:
 * - (required) angular-translate library
 *
 * @Instruction
 * - install angular-translate library and angular-translate-loader-static-files
 * - import this to the application
 * - configure the path to the localization files if you change the location of the files
 * - go here: http://angular-translate.github.io/docs/#/guide/07_multi-language for futher instruction
 * - to handle any events relate to tranlate, please go to app/components/events/localization and create the handler there
 *  .Event for translator can be found here: http://angular-translate.github.io/docs/#/guide/18_events
 *
 */
angular.module('app.config.translate', []).config(function($translateProvider) {
  $translateProvider

  $translateProvider.useStaticFilesLoader({
    prefix: 'resources/languages/locale-',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
  // Enable escaping of HTML
  $translateProvider.useSanitizeValueStrategy('sanitize');
});
