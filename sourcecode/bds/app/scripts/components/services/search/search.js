/**
 * Created by quocviet on 11/1/15.
 */
/**
 * Service to working with router in the app.
 */
angular.module('app.search', []).factory('searchServices', function($location, constants){

  var searchPath = '/search/';										        //default page to be redirect to

  return	{
    /**
     * Search location in city
     * @param cityId {string} city key
     */
    searchInCity:	function(cityId){
      if(!cityId){
        return;
      }

      var setting = {};
      setting[constants.geo.component.typeKey.city] = cityId;
      var query = this.generateLocationSearchQuery(setting);
      if(query){
        $location.path(searchPath + query);
      }

    },

    /**
     * Read the setting and generate a query for browser (similar to get) to pass data to search page
     * @param setting {object} Setting for search page
     * @returns {string} query for brower path
     */
    generateLocationSearchQuery: function(setting){
      var string = '';
      var counter = 0;
      var settingKeys = Object.keys(setting);
      angular.forEach(setting, function(value, key) {
        counter++;
        if(key){
          string += key + '=' + value;
          if(counter != settingKeys.length){
            string += '&';
          }
        }
      });

      if(string && string.length > 0){
        return ':' + string;
      }
      return null;
    }
  }
});

