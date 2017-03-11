/**
 * Created by quocviet on 11/8/15.
 */
/**
 * Directive to create the left panel of the app
 * Requirement:
 * - (required) httpRequest: from component/services/http/httpRequest.js
 * - (required) qvPill: from component/directive/control/pill
 * - (required) qvForm: from component/directives/control/form
 * - (required) angular-translate library
 * - (optional) angular-material library: css and js
 *
 */
angular.module('app.directives.appLeftPanel', []).directive('appLeftPanel', ['$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        config: '=',
      },
      templateUrl: 'scripts/components/directives/sections/leftPanel/tpl/leftPanel.html',
      replace: true,
      controller: function($scope, $q, $translate, httpRequest, api, projectServices, investorServices) {
        /* ============================= [PARAMS] ============================= */
        //keep the stats data
        $scope.stats = {
          total_project: '...',
          total_investor: '...',
        }

        //configuration for popular project list
        $scope.popularProjects = [];
        $scope.popularProjectsConfig = {
          name: 'popular_projects',
          itemTemplateUrl: 'views/templates/default/app/partials/list/projects/leftPanelPopularProjectItem.html',
          items: function(successHandler, failureHandler){
            var fetchData = {
              order: 'view_count',
              sort: 'desc',
              size: 5,
            };

            projectServices.fetchProjects(fetchData, successHandler, failureHandler);
          },
          messages: {
            empty: 'TRANS_PROJECT_EMPTY_ATM',
          }
        };

        //configuration for popular investor list
        $scope.popularInvestors = [];
        $scope.popularInvestorsConfig = {
          name: 'popular_investors',
          itemTemplateUrl: 'views/templates/default/app/partials/list/investors/leftPanelPopularInvestorItem.html',
          items: function(successHandler, failureHandler){
            var fetchData = {
              order: 'view_count',
              sort: 'desc',
              size: 5,
            };

            investorServices.fetchInvestors(fetchData, successHandler, failureHandler);

          },
          messages: {
            empty: 'TRANS_INVESTOR_EMPTY_ATM',
          }
        };
        /* ============================= [END PARAMS] ============================= */

        /* ============================= [FUNCTIONS] ============================= */
        /**
         * Load the stat from api. This stat will be used to display on left panel
         * @param successHandler  {callback} Call if success
         * @param failureHandler  {callback} Call if failure
         */
        $scope.loadStat = function(successHandler, failureHandler){
          var statDeferred = $q.defer();
          var statRequest = new httpRequest(api.url('stat'), {
            sort: 'view_count',
            order: 'desc',
            size: 5,
          }, statDeferred.resolve, statDeferred.reject);

          //handle the callback from api call
          statDeferred.promise
            .then(function(data) {
              //if success
              if(successHandler){
                successHandler(data.data, data.status, data.headers, data.config);
              }

              //set the value to stat
              $scope.stats = {
                total_project: data.data.data.total_project,
                total_investor: data.data.data.total_investor,
              }

            }, function(data) {
              //if failed
              if(failureHandler){
                failureHandler(data.data, data.status, data.headers, data.config);
              }
            });

          statRequest.request();
        }
        /* ============================= [END FUNCTIONS] ============================= */

        /* ============================= [PRECALL] ============================= */
        //load the stat when the page loaded
        $scope.loadStat();
        /* ============================= [END PRECALL] ============================= */
      }
    };
  }
]);
