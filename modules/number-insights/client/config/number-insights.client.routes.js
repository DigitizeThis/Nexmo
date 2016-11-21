(function () {
  'use strict';

  angular
    .module('number-insights')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('number-insights', {
        abstract: true,
        url: '/number-insights',
        template: '<ui-view/>'
      })
      .state('number-insights.list', {
        url: '',
        templateUrl: 'modules/number-insights/client/views/list-number-insights.client.view.html',
        controller: 'NumberInsightsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Number insights List'
        }
      })
      .state('number-insights.create', {
        url: '/create',
        templateUrl: 'modules/number-insights/client/views/form-number-insight.client.view.html',
        controller: 'NumberInsightsController',
        controllerAs: 'vm',
        resolve: {
          numberInsightResolve: newNumberInsight
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Number insights Create'
        }
      })
      .state('number-insights.edit', {
        url: '/:numberInsightId/edit',
        templateUrl: 'modules/number-insights/client/views/form-number-insight.client.view.html',
        controller: 'NumberInsightsController',
        controllerAs: 'vm',
        resolve: {
          numberInsightResolve: getNumberInsight
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Number insight {{ numberInsightResolve.name }}'
        }
      })
      .state('number-insights.view', {
        url: '/:numberInsightId',
        templateUrl: 'modules/number-insights/client/views/view-number-insight.client.view.html',
        controller: 'NumberInsightsController',
        controllerAs: 'vm',
        resolve: {
          numberInsightResolve: getNumberInsight
        },
        data: {
          pageTitle: 'Number insight {{ numberInsightResolve.name }}'
        }
      });
  }

  getNumberInsight.$inject = ['$stateParams', 'NumberInsightsService'];

  function getNumberInsight($stateParams, NumberInsightsService) {
    return NumberInsightsService.get({
      numberInsightId: $stateParams.numberInsightId
    }).$promise;
  }

  newNumberInsight.$inject = ['NumberInsightsService'];

  function newNumberInsight(NumberInsightsService) {
    return new NumberInsightsService();
  }
}());
