/**
 * Created by quocviet on 10/18/15.
 */
/**
 * @Requirement:
 * - (optional) angular-material library: css and js
 * - (optional) angular-tranlate library
 * - (required) httpRequest from components.services.http.httpRequest
 * - (required) ngEnter from components.directives.input.keyboard.qvKeyboardInput.js
 *
 * @Description
 * Directive to quickly setup a form to send data to server, or do some custom work
 *
 * @Configuration
 * I-Setup params
 *  Make sure to setup the following data
 *   1.Path to inputs template: variable pathToInputTemplate
 *   2.Path to validation template: variable pathToValidationTemplate
 * II-Input params
 * 1.model
 *  the model will held all the form data. we can use this to get or set form data as will
 *  if model is not set, the library will create a inner scope data to work with.
 *
 * 2.config
 *  {
 *    name: [string] [required] unique name (also id) of the form. Do not have 2 forms with same name
 *
 *    submit: [dict] [optional] If not set, the lib will using default value.
 *    {
 *      type: [string] [optional] [POST,GET,PUT,PATCH,DELETE,HEAD,JSONP]
 *        Default set to POST. The library will automatically convert the input string into uppercase,
 *      url: [function] [optional]
 *        @params: none
 *        @returns: [string/null] : If the function return null, mean the form wont post the data to anywhere.
 *      extraData: [array] [optional]
 *        The extra data will be send together with the request. If duplicate with a field in the form, it will override it
 *    }
 *
 *    events: [dict] [optional] If not set, the lib will using default value.
 *    {
 *      onBeforeSubmit: [function] [optional]
 *        @params:
 *          formData [dict] current data of the form
 *        @returns: [boolean] If false, the form wont be submit and the submit process will stop.
 *        This function will be called even if the submit is not set.
 *        If you wish to handle the submit by yourself, simply return false and do your works in this function.
 *
 *      onAfterSubmit: [function] [optional]
 *        @condition:
 *          if onBeforeSubmit return true
 *          if submit.url is set
 *          if validation is pass
 *        @params:
 *          formData [dict] current data of the form
 *          response [dict/null] the reponse of the request. If this isnt a request from server, this will be set to null
 *        @returns: [no return]
 *    }
 *
 *    fields: [array of sections] [required]
 *      @example
 *      [
 *        //section 1
 *        {
 *           title: 'title',
 *           name: 'section1',
 *           fields: [
 *            [
 *              field 1, field 2
 *            ],
 *            [
 *              field 3
 *            ]
 *           ]
 *        }
 *      ]
 *      Each array is an section with format:
 *      {
 *        title: [string/null] [optional] this is the title of the section, will be display in text and a divider line on top of each section (as a seperate line between them).
 *          if set to null, the section title wont display
 *        name: [required]  Will help search for section field items quicker
 *        fields: [array] [required]
 *          The fields in this lib is input in array format, with table layout in mind. Let say we have [[field 1, field 2], [field 3]]
 *          It mean that field 1 and field 2 belong to first part, and field 3 is in second part. Normally, each path is a row, but for phone
 *          view, may be each part can be a column.
 *          As for field configuration, check Fields_configuration section in the documents
 *      }
 *  }
 *
 *  @Localication
 *    The directive make use of angular-translation library. So just put your label or translation holder into label or message
 *    they will be tranlated late
 *
 *  @Fields_Configuration
 *
 *  @Validations
 *    @required
 *      type: required
 *      apply to: [all]
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *    @minlength
 *      type: minlength
 *      value: [number]
 *      apply to: [all]
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *    @maxlength
 *      type: maxlength
 *      value: [number]
 *      apply to: [all]
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *    @pattern
 *      type: pattern
 *      apply to: [all], [except email]
 *      value: [string] pattern. For example: /^.+@.+\..+$/ for email
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *    @min
 *      type: min
 *      apply to: [number, date]
 *      value: [number]
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *    @max
 *      type: max
 *      apply to: [number, date]
 *      value: [number]
 *      message: [string] [optional] If not set will use the default . Will be override if group message is set.
 *
 *  @Common_Attributes
 *    type: [string] [required] the type of the input
 *    name: [string] [required] unique name of the input, will be used as model name
 *    label: [string] [optional] If it is button, this is the button label. If it is input, it is the input label. For input field, this is
 *      treated as placeholder too (thanks to material design concept)
 *    validation: [dict] [optional] Check Validations section for more detail
 *      {
 *        validations: [array] list of validation item
 *        message: [string] [optional] If this is set, all the other message will be override
 *      }
 *    events: [dict] [optional] Each item will have its own set of event. Check the field for more detail
 *
 *  @Text
 *    type: text
 *    events: {
 *      onEnter: [function]
 *        @params:
 *          field: the field configuration
 *          directive: this directive instant
 *        @returns: [no return]
 *    }
 *
 *  @Password
 *    type: password
 *    events: {
 *      onEnter: [function]
 *        @params:
 *          field: the field configuration
 *          directive: this directive instant
 *        @returns: [no return]
 *    }
 *
 *  @Email
 *    type: email
 *    validation: [remind] Always have pattern validation for email form
 *    events: {
 *      onEnter: [function]
 *        @params:
 *          field: the field configuration
 *          directive: this directive instant
 *        @returns: [no return]
 *    }
 *
 *  @Sumbit_Button
 *    type: submit
 */
angular.module('open_source.directives.qvForm', []).directive('qvForm', ['$timeout', '$compile',
  function($timeout, $compile) {
    return {
      restrict: 'E',
      scope: {
        config: '=',                            //contain the configuration data which will generate the directive
        model: '=',                             //the model will held all the form data. we can use this to get or set form data as will
      },
      templateUrl: 'components/directives/controls/form/tpl/qvForm.html',
      replace: true,
      controller: function($scope, $element, $q, httpRequest) {
        /* ============================= [INPUT PARAMS] ============================= */
        //override the config scope, set defaut for any data dont set
        $scope.formConfig = {
          name: $scope.config.name,

          submit: {
            type: ($scope.config.submit && $scope.config.submit.type)?(angular.uppercase($scope.config.submit.type)):'POST',
            url: ($scope.config.submit && $scope.config.submit.url)?$scope.config.submit.url:function(){
              return null;
            },
            extraData: null,
          },

          events:{
            onBeforeSubmit: ($scope.config.events && $scope.config.events.onBeforeSubmit)?$scope.config.events.onBeforeSubmit:function(formData){
              return true;
            },
            onAfterSubmit: ($scope.config.events && $scope.config.events.onAfterSubmit)?$scope.config.events.onAfterSubmit:function(formData, response){

            }
          },

          fields:$scope.config.fields,
        }

        //if model is not set, we will create a inner scope data to work with
        $scope.formModel = ($scope.model)?$scope.model:{};

        /* ============================= [END INPUT PARAMS] ============================= */

        /* ============================= [CONFIGURATION PARAMS] ============================= */
        $scope.pathToInputTemplate = 'components/directives/controls/form/';                        //path to the input template folder. Make sure to configurate this on each of your project if you change the library location
        $scope.pathToValidationTemplate = 'components/directives/controls/form/validation/';                        //path to the validation template folder. Make sure to configurate this on each of your project if you change the library location
        /* ============================= [END CONFIGURATION PARAMS] ============================= */

        /* ============================= [PARAMS] ============================= */
        $scope.directive = null;                                                                   //pointer to current directive

        //loader configurtion and helper
        $scope.loader = {
          loading: false,                                                                        //flag to know if the loader is show or not

          /**
           * Show the loader
           * @param duration  [float/null] Second until hide.
           * If null or 0, the loader will show until hide function is called. Otherwise
           * it will stop after the duration run out.
           */
          show: function(duration){
            if(!$scope.loader.loading){
              $scope.loader.loading = true;

              if(duration){
                $timeout( function(){ $scope.loader.hide(); }, duration);
              }
            }
          },

          /**
           * Hide the loader if visible
           */
          hide: function(){
            if($scope.loader.loading){
              $scope.loader.loading = false;
            }
          }
        }

        /* ============================= [END PARAMS] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * Will the given field be disabled? Do all the check here
         * @param field The field configuration
         * @returns {boolean}
         */
        $scope.fieldDisableCheck = function(field){
          if($scope.loader.loading){
            return true;
          }

          return false;
        }

        /**
         * Function to check if we will show the validation message section for the given field
         * @param field The selected field
         * @returns {boolean}
         */
        $scope.willShowValidationMessage = function(field){
          if($scope.directive && $scope.directive[$scope.formConfig.name][field.name].$dirty){
            var error = $scope.directive[$scope.formConfig.name][field.name].$error;
            if(error && Object.keys(error).length > 0){
              return true;
            }
          }

          return false;
        }

        /**
         * The function to get the path to the template of the given field. The field have to have available Type,
         * otherwise, the path is null
         * @param field: the field configuration.
         * @returns {string/null} Path to the template
         */
        $scope.getInputTemplate = function(field){
          if(!field || !field.type){
            console.log('field configuration is missing');
            return null;
          }

          if(angular.uppercase(field.type) == 'TEXT'){
            return $scope.pathToInputTemplate + 'fields/text.html';
          } else if(angular.uppercase(field.type) == 'EMAIL'){
            return $scope.pathToInputTemplate + 'fields/email.html';
          } else if(angular.uppercase(field.type) == 'PASSWORD'){
            return $scope.pathToInputTemplate + 'fields/password.html';
          } else if(angular.uppercase(field.type) == 'SUBMIT'){
            return $scope.pathToInputTemplate + 'buttons/submit.html';
          }

          return null;
        }

        /**
         * Get the path to validation template field. The field have to have available Type,
         * otherwise, the path is null
         *
         * @param field: the field configuration.
         * @returns {string/null} Path to the template
         */
        $scope.getValidationTemplate = function(field){
          if(!field || !field.type){
            console.log('field configuration is missing');
            return null;
          }

          return $scope.pathToValidationTemplate + 'validation.html'
        }

        /**
         * Convert all the form data into one single, sendable data which will be used by the function
         * This function is called after the onBeforeSumbit
         */
        $scope.getSubmitData = function(){
          var submitData = {};

          if(!$scope.formModel){
            return submitData;
          }

          angular.forEach($scope.formModel, function(value, key) {
            submitData[key] = value;
          });

          if($scope.formConfig.submit && $scope.formConfig.submit.extraData){
            angular.forEach($scope.formConfig.submit.extraData, function(value, key) {
              submitData[key] = value;
            });
          }

          return submitData;
        }

        /**
         * Call the submit function base on the setting
         * Case 1: If url is set and onBeforeSubmit return true, post the data to url
         * Case 2: If url isnt set or onBeforeSubmit return false, do only the work in the obBeforeSubmit scope
         * @param successHandler  It wont be called if case 2 happen
         * @param failureHandler It wont be called if case 2 happen
         */
        $scope.submit = function(successHandler, failureHandler){
          if(!$scope.directive[$scope.formConfig.name].$valid){
            return;
          }

          //this event will always call this function. But only if the result is true, it will handle the form post functions
          if(!$scope.formConfig.events.onBeforeSubmit){
            return;
          }
          var onBeforeSubmitResult = $scope.formConfig.events.onBeforeSubmit($scope.formModel);
          if(!onBeforeSubmitResult){
            //dont do anything
            return;
          }

          //if user dont set the url, the directive wont do anything either
          var remoteUrl = $scope.formConfig.submit.url();
          if(!$scope.formConfig.submit || !remoteUrl){
            return;
          }

          //submit the data
          var submitData = $scope.getSubmitData();
          var submitDeferred = $q.defer();
          var submitRequest = new httpRequest(remoteUrl, submitData, submitDeferred.resolve, submitDeferred.reject);

          //handle the callback from api call
          submitDeferred.promise
            .then(function(data) {
              //hide message
              $scope.loader.hide();

              //if success
              if(successHandler){
                successHandler(data.data, data.status, data.headers, data.config);
              }

              if($scope.formConfig.events.onAfterSubmit){
                $scope.formConfig.events.onAfterSubmit($scope.formModel, {
                  data: data.data,
                  status: data.status,
                  headers: data.headers,
                  config: data.config
                });
              }

            }, function(data) {
              //hide message
              $scope.loader.hide();

              //if failed
              if(failureHandler){
                failureHandler(data.data, data.status, data.headers, data.config);
              }

              $scope.formConfig.events.onAfterSubmit($scope.formModel, {
                data: data.data,
                status: data.status,
                headers: data.headers,
                config: data.config
              });
            });

          //call the request and start the loader
          $scope.loader.show();
          submitRequest.request();
        }

        /* ----------------------------- [VALIDATIONS] ----------------------------- */
        /**
         * Get the validations list of a field.
         *
         * @param field: the field configuration.
         * @returns [array] The return is list of validation name. Each item is a validation name, for example ['required']
         */
        $scope.getFieldValidationList = function(field){
          var validations = [];

          if(field.validation && field.validation.validations && field.validation.validations.length > 0){
            angular.forEach(field.validation.validations, function(value, key) {
              validations.push(value.type);
            });
          }
          return validations;
        }

        /**
         * Get the validation object of the selected field
         * @param field  The selected field
         * @param validationName The name of the validation we want to get detail
         * @returns {list/null} If the name is invalid, or field dont have this validation, return null. Otherwise,
         * return the validation data
         */
        $scope.getValidationOfField = function(field, validationName){
          if(field && validationName && field.validation && field.validation.validations && field.validation.validations.length > 0){
            for(var i = 0; i < field.validation.validations.length; i++){
              var validator = field.validation.validations[i];
              if(angular.lowercase(validator.type) == angular.lowercase(validationName)){
                return validator;
              }
            }
          }

          return null;
        }

        /**
         * Return the associated value for selected validator
         * @param field  The selected field
         * @param validationName The name of the validation we want to get detail
         * @returns {value/undefined} If not have value, undefined will be return because it will disable validator with ng-attr
         */
        $scope.getValidationValueOfField = function(field, validationName){
          var validator = $scope.getValidationOfField(field, validationName);
          if(validator){
            if(angular.lowercase(validator.type) == 'required'){
              return '1';
            }
            else if(angular.lowercase(validator.type) == 'minlength'){
              return (validator.value)?validator.value:undefined;
            }
            else if(angular.lowercase(validator.type) == 'maxlength'){
              return (validator.value)?validator.value:undefined;
            }
            else if(angular.lowercase(validator.type)== 'pattern'){
              return (validator.value)?validator.value:undefined;
            }
            else{
              return undefined;
            }
          }

          return undefined;
        }

        /**
         * Check if this form is valid or not
         * @returns {boolean|*}
         */
        $scope.isFormValid = function(){
          if($scope.directive){
            return $scope.directive[$scope.formConfig.name].$valid;
          }

          return false;
        }
        /* ----------------------------- [END VALIDATIONS] ----------------------------- */

        /* ----------------------------- [EVENTS] ----------------------------- */
        /**
         * Trigger the event with given name on selected field
         * @param field [object] the field configuration
         * @param eventName [string] name of the event
         */
        $scope.fieldEvent = function(field, eventName){
          if(!field || !eventName){
            return;
          }

          if(eventName == 'onEnter'){
            if(field.events && field.events.onEnter){
              field.events.onEnter(field, $scope.directive);
            }
          }
        }

        /**
         * Event when the form is initialized
         * @param form The current form
         */
        $scope.initForm = function(directive){
          $scope.directive = directive;
        }

        /**
         * When user hit the submit button
         */
        $scope.onSubmit = function(){
          $scope.submit();
        }
        /* ----------------------------- [END EVENTS] ----------------------------- */

        /* ============================= [END FUNCTIONS] ============================= */

      }
    };
  }
]);
