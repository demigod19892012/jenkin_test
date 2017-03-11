/**
 * Created by quocviet on 11/3/15.
 */
/**
 * Keepp all the constant of the application
 */
angular.module('app.constants', []).factory('constants', [function () {
  return {
    'authority' : {
      'user': 1,
      'admin': 2
    },

    'status' : {
      'active': 2,
      'de_active': 1
    },

    'unit': {
      'size': 'm2',
      'currency': 'VND',
    },

    'geo': {
      component: {
        type: {
          'city': 'administrative_area_level_1',
          'locality': 'locality',
          'route': 'route',
          'area': 'administrative_area_level_2',
        },
        typeKey: {
          'city': 'c',
          'locality': 'l',
          'route': 'r',
          'area': 'a',
        }
      }
    }
  };

}]);

