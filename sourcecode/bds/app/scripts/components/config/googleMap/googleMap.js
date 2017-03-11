/**
 * Created by quocviet on 11/30/15.
 */
/**
 * This is require for using google map api V3
 *
 * @Source:
 * - https://angular-ui.github.io/angular-google-maps/#!/api/GoogleMapApi
 */
angular.module('app.config.googleMap', []).config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyD2ck0xS5dOJCg1Vuc1zUHuwMl113Y39Kk',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})
