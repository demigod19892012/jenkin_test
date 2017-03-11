angular.module('app.template', []).factory('templateService', [function () {
  var template = {};

  var templates = {
    default: {
      name:'default',
      class: 'app_container',
      bodyClass: '',
    },
    adminLogin: {
      name:'adminLogin',
      class: 'admin_login_container',
      bodyClass: 'body_admin_login',
    }
  };

  var currentTemplate = templates.default;

  /**
   * Get function of main template variable
   * @returns {string}
   */
  template.mainTemplate = function() {
    return currentTemplate;
  };

  /**
   * Set the main template
   * @param value template name
   */
  template.setMainTemplate = function(value) {
    if(value == templates.default.name){
      currentTemplate = templates.default;
    }
    else if(value == templates.adminLogin.name){
      currentTemplate = templates.adminLogin;
    }
    else{
      currentTemplate = null;
    }
  };

  return template;
}]);
