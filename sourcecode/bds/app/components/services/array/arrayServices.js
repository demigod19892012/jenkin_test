/**
 * Created by quocviet on 11/28/15.
 */
/**
 * Helper services which deal with common feature of array
 */
angular.module('open_source.services.arrayServices', []).factory('arrayServices', function(){
  var service = {};

  /**
   * Function to convert array into string list. For example, [1,2,3] will become "1-2-3" if separator is -
   * @param items {array} list of items
   * @param separator {string} character which will become the separator
   * @returns {string}
   */
  service.toStringWithSeparate = function(items, separator){
    var result = '';

    for(var i = 0; i < items.length; i++){
      result += items[i] + ((i != items.length - 1 )?separator:'');
    }

    return result;
  }

  return service;
});
