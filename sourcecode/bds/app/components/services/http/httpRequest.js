//the object which we will use to call any http request.
angular.module('open_source.services.http', []).factory('httpRequest', function($http, $q, $timeout){
  var httpRequest = function(url, data, successHandler, failureHandler, method, type, contentType) {
    var thisHttpRequest = this;										//hold an object which is actually this request

    //set defaults properties and functions
    angular.extend(this, {
      /* ---------- properties ---------- */
      url: url,													//request url
      data: data,													//request data
      successHandler: successHandler,								//success handler
      failureHandle: failureHandler,								//failure handler
      method: (method)?method:'POST',												//requestType: GET, POST, DELETE, PUT, ...
      type: (type)?type:'FORM',												//FORM or JSON
      canceler: $q.defer(),										//canceler to abort request
      timeout: 100000,											//timeout to automatically cancel request
      didRequest: false,											//check if this request is called or not? If called once, this will be set as true
      lastRequestResult: false,									//true if success, false if result in failure
      lastRequestData: null,										//hold the last request data
      lastRequestStatus: null,									//hold the last request status
      contentType: (contentType)?contentType:undefined,

      /* ---------- functions ---------- */
      /**
       *
       * Make request with given url and data
       */
      request:function(){
        if(!this.url){
          console.log("Url isn't set. Cannot make request");
          return false;
        }

        var requestData = this.data;
        //if this is JSON request type, convert this to json
        if(angular.equals(angular.uppercase(this.type), 'JSON')){
          requestData = JSON.stringify(this.data);
        }
        else if(angular.equals(angular.uppercase(this.type), 'FORM')){
          var requestData = new FormData();
          angular.forEach(this.data, function(value, key) {
            requestData.append(key, value);
          });
        }

        var requestConfig = {
          transformRequest: angular.identity,
          headers: {'Content-Type': this.contentType},
          timeout: (this.canceler)?this.canceler.promise:null,
        }

        var failure_callback = function(data, status, headers, config) {
          thisHttpRequest.didRequest = true;
          thisHttpRequest.lastRequestResult = false;
          thisHttpRequest.lastRequestData = data;
          thisHttpRequest.lastRequestStatus = status;
          if(failureHandler){
            failureHandler({
              data: data,
              status: status,
              headers: headers,
              config: config
            });
          }
        }

        var success_callback = function(data, status, headers, config) {
          thisHttpRequest.didRequest = true;
          thisHttpRequest.lastRequestResult = true;
          thisHttpRequest.lastRequestData = data;
          thisHttpRequest.lastRequestStatus = status;
          if(successHandler){
            successHandler(
              {
                data: data,
                status: status,
                headers: headers,
                config: config
              }
            );
          }
        }

        //base on the method, we call different way
        var request = null;
        if(angular.equals(angular.uppercase(this.method), 'POST')){
          request = $http.post(this.url, requestData, requestConfig).success(success_callback).error(failure_callback);
        }
        else if(angular.equals(angular.uppercase(this.method), 'PUT')){
          request = $http.put(this.url, requestData, requestConfig).success(success_callback).error(failure_callback);
        }
        else if(angular.equals(angular.uppercase(this.method), 'PATCH')){
          request = $http.patch(this.url, requestData, requestConfig).success(success_callback).error(failure_callback);
        }
        else if(angular.equals(angular.uppercase(this.method), 'DELETE')){
          request = $http.delete(this.url, requestConfig).success(success_callback).error(failure_callback);
        }
        else if(angular.equals(angular.uppercase(this.method), 'HEAD')){
          request = $http.head(this.url, requestConfig).success(success_callback).error(failure_callback);
        }
        else if(angular.equals(angular.uppercase(this.method), 'JSONP')){
          request = $http.jsonp(this.url, requestConfig).success(success_callback).error(failure_callback);
        }
        else{
          //GET
          requestConfig.params = this.data;
          request = $http.get(this.url, requestConfig).success(success_callback).error(failure_callback);
        }

        if(request){
          $timeout(function() {
            thisHttpRequest.canceler.resolve('Timeout! Request canceled');
          }, this.timeout);
        }

        return request;
      },

      /**
       *
       * Cancel the current request
       */
      cancel:function(message){
        this.canceler.resolve((message)?message:'Request got canceled');
      }
    });
  };
  return httpRequest;
});
