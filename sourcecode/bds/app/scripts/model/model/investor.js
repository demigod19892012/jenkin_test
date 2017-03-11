/**
 * Created by quocviet on 11/15/15.
 */
/**
 * The object represent the investor model on the server side.
 */
angular.module('app.model.investor', []).factory('investorModel', function(constants){
  var investorModel = function(data) {
    var thisModel = this;											//hold an object which is actually this service

    //set defaults properties and functions
    angular.extend(this, {
      /* ---------- properties ---------- */
      id: (data && data.id)?data.id:null,
      code: (data && data.code)?data.code:null,
      name: (data && data.name)?data.name:null,
      description: (data && data.description)?data.description:null,
      address: (data && data.address)?data.address:null,
      address_coor: (data && data.address_coor)?data.address_coor:null,
      website_url: (data && data.website_url)?data.website_url:null,
      system_rating: (data && data.system_rating)?data.system_rating:null,
      view_count: (data && data.view_count)?data.view_count:null,
      active_status: (data && data.active_status)?data.active_status:2,                       //default is active
      deleted_at: (data && data.deleted_at)?data.deleted_at:null,
      updated_at: (data && data.updated_at)?data.updated_at:null,
      created_at: (data && data.created_at)?data.created_at:null,
      logo: (data && data.logo)?data.logo:null,
      total_project: (data && data.total_project)?data.total_project:null,
      address_components: (data && data.address_components)?data.address_components:null,
      /* ---------- functions ---------- */
      /**
       * Initialize function, call after the object is created
       */
      init: function(){
        thisModel.convertAddressComponents();
      },

      /**
       * Is this user active or not?
       * @returns {boolean}
       */
      isActive: function(){
        return (parseInt(this.active_status) == constants.status.active);
      },

      /**
       * We get can convert the address from server to a format we can read
       */
      convertAddressComponents: function(){
        var addressObject = {
          'full_text': '',
          'componenents': {}
        }

        if(thisModel.address){
          addressObject.full_text = thisModel.address;
        }

        if(thisModel.address_components && thisModel.address_components.length > 0){
          //first we convert this array to dictionary
          angular.forEach(thisModel.address_components, function(value, key){
            if(value.address_component_data && value.address_component_data.type){
              addressObject.componenents[value.address_component_data.type] = value
            }
          });
        }

        addressObject.full_text += (addressObject.componenents.route)?(', ' + addressObject.componenents.route.address_component_data.value):'';
        addressObject.full_text += (addressObject.componenents.locality)?(', ' + addressObject.componenents.locality.address_component_data.value):'';
        addressObject.full_text += (addressObject.componenents.administrative_area_level_2)?(', ' + addressObject.componenents.administrative_area_level_2.address_component_data.value):'';
        addressObject.full_text += (addressObject.componenents.administrative_area_level_1)?(', ' + addressObject.componenents.administrative_area_level_1.address_component_data.value):'';

        thisModel.address_data = addressObject;
      },

      /**
       * reload the user data with given data
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

  return investorModel;
});
