(function () {
  'use strict';

  angular
    .module('dashboards')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboards', {
        abstract: true,
        url: '/dashboards',
        template: '<ui-view/>'
      })
      .state('dashboards.list', {
        url: '',
        templateUrl: 'modules/dashboards/client/views/list-dashboards.client.view.html',
        controller: 'DashboardsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dashboards List'
        }
      })
      .state('dashboards.create', {
        url: '/create',
        templateUrl: 'modules/dashboards/client/views/form-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: newDashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Dashboards Create'
        }
      })
      .state('dashboards.edit', {
        url: '/:dashboardId/edit',
        templateUrl: 'modules/dashboards/client/views/form-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: getDashboard
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Dashboard {{ dashboardResolve.name }}'
        }
      })
      .state('dashboards.view', {
        url: '/:dashboardId',
        templateUrl: 'modules/dashboards/client/views/view-dashboard.client.view.html',
        controller: 'DashboardsController',
        controllerAs: 'vm',
        resolve: {
          dashboardResolve: getDashboard
        },
        data: {
          pageTitle: 'Dashboard {{ dashboardResolve.name }}'
        }
      });
  }

  getDashboard.$inject = ['$stateParams', 'DashboardsService'];

  function getDashboard($stateParams, DashboardsService) {
    return DashboardsService.get({
      dashboardId: $stateParams.dashboardId
    }).$promise;
  }

  newDashboard.$inject = ['DashboardsService'];

  function newDashboard(DashboardsService) {
    return new DashboardsService();
  }
}());
