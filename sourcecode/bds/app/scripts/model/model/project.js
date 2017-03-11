/**
 * Created by quocviet on 11/15/15.
 */
/**
 * The object represent the project model on the server side.
 */
angular.module('app.model.project', []).factory('projectModel', function(constants, $filter){
  var projectModel = function(data) {
    var thisModel = this;											//hold an object which is actually this service

    //set defaults properties and functions
    angular.extend(this, {
      /* ---------- properties ---------- */
      id: (data && data.id)?data.id:null,
      code: (data && data.code)?data.code:null,
      name: (data && data.name)?data.name:null,
      description: (data && data.description)?data.description:null,
      full_description: (data && data.full_description)?data.full_description:null,
      address: (data && data.address)?data.address:null,
      address_coor: (data && data.address_coor)?data.address_coor:null,
      land_size_min: (data && data.land_size_min)?data.land_size_min:null,
      land_size_max: (data && data.land_size_max)?data.land_size_max:null,
      avg_price: (data && data.avg_price)?data.avg_price:null,
      price_unit: (data && data.price_unit)?data.price_unit:null,
      avg_price_rent: (data && data.avg_price_rent)?data.avg_price_rent:null,
      rent_price_unit: (data && data.rent_price_unit)?data.rent_price_unit:null,
      open_bid_date: (data && data.open_bid_date)?data.open_bid_date:null,
      start_construct_date: (data && data.start_construct_date)?data.start_construct_date:null,
      end_construct_plan_date: (data && data.end_construct_plan_date)?data.end_construct_plan_date:null,
      end_construct_date: (data && data.end_construct_date)?data.end_construct_date:null,
      land_type: (data && data.land_type)?data.land_type:null,
      per_construct_complete: (data && data.per_construct_complete)?data.per_construct_complete:null,
      system_rate: (data && data.system_rate)?data.system_rate:null,
      project_status: (data && data.project_status)?data.project_status:null,
      view_count: (data && data.view_count)?data.view_count:null,
      active_status: (data && data.active_status)?data.active_status:2,                       //default is active
      deleted_at: (data && data.deleted_at)?data.deleted_at:null,
      updated_at: (data && data.updated_at)?data.updated_at:null,
      created_at: (data && data.created_at)?data.created_at:null,
      main_image: (data && data.main_image)?data.main_image:null,
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
       * Get the readable process
       * @returns {string}
       */
      process: function(){
        if(this.per_construct_complete == 0){
          return 'TRANS_PROCESS_HAVENT_START';
        }
        else if(this.per_construct_complete == 100){
          return 'TRANS_PROCESS_COMPLETED';
        }
        else{
          return 'TRANS_PROCESS_ONGOING';
        }
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
       * Get the readable size
       * @returns {string}
       */
      size: function(){
        var min = (this.land_size_min)?(this.land_size_min + constants.unit.size): 'N/A';
        var max = (this.land_size_max)?(this.land_size_max + constants.unit.size): 'N/A';
        return min + ' - ' + max;
      },

      avgPrice: function(){
        return (this.avg_price)?($filter('currency')(this.avg_price, constants.unit.currency, 0) + '/' + constants.unit.size):'N/A'
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

  return projectModel;
});
