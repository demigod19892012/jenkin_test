/**
 * Created by quocviet on 11/3/15.
 */
angular.module('app.model', [
    'app.model.user',
    'app.model.project',
    'app.model.investor',
    'app.model.addressComponent',

    'app.model.services.projectServices',
    'app.model.services.investorServices',
    'app.model.services.geoServices',
    'app.model.services.projectGeoStatisticServices'
  ]
);
