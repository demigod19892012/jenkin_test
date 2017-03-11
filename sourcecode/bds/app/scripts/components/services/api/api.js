/**
 * Created by quocviet on 10/26/15.
 */
angular.module('app.api', []).factory('api', [function () {
  var server = '';										//url of the server

  return {
    /**
     * Set the server url.
     * @recommend: Do this in the main controller
     *
     * @param value [string] server url
     */
    setServer: function (value) {
      server = value;
    },

    /**
     * Get the server url
     * @returns {string}
     */
    server: function () {
      return server;
    },

    /**
     * Get the full url of the api from the given name
     * @param name [string] Name of the api (case sensitive)
     * @returns [string] Full url to the api
     */
    url: function(name){
      switch(name) {
        case 'signIn':
          return server + '/' + 'b_admin/auth/signIn';
          break;
        case 'signOut':
          return server + '/' + 'b_admin/auth/signOut';
          break;
        case 'stat':
          return server + '/' + 'bds/stat/stat';
          break;
        case 'fetchProjects':
          return server + '/' + 'bds/project/list';
          break;
        case 'fetchInvestors':
          return server + '/' + 'bds/investor/list';
          break;
        case 'geoFetchCities':
          return server + '/' + 'bds/geo/cities';
          break;
        case 'geoFetchLocalities':
          return server + '/' + 'bds/geo/localities';
          break;
        case 'geoFetchRoutes':
          return server + '/' + 'bds/geo/routes';
          break;
        case 'geoFetchAreas':
          return server + '/' + 'bds/geo/areas';
          break;
        case 'geoJson':
          return server + '/' + 'bds/geo/geoJson';
          break;
        case 'projectGeoDistributionData':
          return server + '/' + 'bds/project/statistic/geoDistribution';
          break;
        default:
          return "";
      }
    }
  };

}]);

