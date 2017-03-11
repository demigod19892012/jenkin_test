/**
 * Created by quocviet on 11/25/15.
 */
/**
 * The object represent the address component model on the server side.
 */
angular.module('app.model.addressComponent', []).factory('addressComponentModel', function(constants){
  var addressComponentModel = function(data) {
    var thisModel = this;											//hold an object which is actually this service

    //set defaults properties and functions
    angular.extend(this, {
      /* ---------- properties ---------- */
      id: (data && data.id)?data.id:null,
      type: (data && data.type)?data.type:null,
      value: (data && data.value)?data.value:null,
      non_unicode_value: (data && data.non_unicode_value)?data.non_unicode_value:null,
      key: (data && data.key)?data.key:null,
      parent: (data && data.parent)?data.parent:null,
      cen_lat: (data && data.cen_lat)?data.cen_lat:null,
      cen_long: (data && data.cen_long)?data.cen_long:null,
      deleted_at: (data && data.deleted_at)?data.deleted_at:null,
      updated_at: (data && data.updated_at)?data.updated_at:null,
      created_at: (data && data.created_at)?data.created_at:null,
      /* ---------- functions ---------- */
      /**
       * Initialize function, call after the object is created
       */
      init: function(){

      },

      /**
       * reload the object data with given data
       * @param data {dictionary} array of data which match user properties. If property is missing, the system will
       * treat it as null
       */
      reloadWithData: function(data){
        angular.forEach(thisModel, function(value, key) {
          //we wont touch the functions
          if (typeof thisModel[key] !== "function") {
            //do not check for !data[key] since we want to get 0 and null too
            if(data.hasOwnProperty(key)){
              thisModel[key] = data[key];
            }
            else{
              thisModel[key] = null;
            }
          }
        });
      },

    });

    /* ============================ [PRECALL] ============================ */
    thisModel.init();
  };

  return addressComponentModel;
});
