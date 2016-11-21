(function () {
  'use strict';

  angular
    .module('messagings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('messagings', {
        abstract: true,
        url: '/messagings',
        template: '<ui-view/>'
      })
      .state('messagings.list', {
        url: '',
        templateUrl: 'modules/messagings/client/views/list-messagings.client.view.html',
        controller: 'MessagingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Messagings List'
        }
      })
      .state('messagings.create', {
        url: '/create',
        templateUrl: 'modules/messagings/client/views/form-messaging.client.view.html',
        controller: 'MessagingsController',
        controllerAs: 'vm',
        resolve: {
          messagingResolve: newMessaging
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Messagings Create'
        }
      })
      .state('messagings.edit', {
        url: '/:messagingId/edit',
        templateUrl: 'modules/messagings/client/views/form-messaging.client.view.html',
        controller: 'MessagingsController',
        controllerAs: 'vm',
        resolve: {
          messagingResolve: getMessaging
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Messaging {{ messagingResolve.name }}'
        }
      })
      .state('messagings.view', {
        url: '/:messagingId',
        templateUrl: 'modules/messagings/client/views/view-messaging.client.view.html',
        controller: 'MessagingsController',
        controllerAs: 'vm',
        resolve: {
          messagingResolve: getMessaging
        },
        data: {
          pageTitle: 'Messaging {{ messagingResolve.name }}'
        }
      });
  }

  getMessaging.$inject = ['$stateParams', 'MessagingsService'];

  function getMessaging($stateParams, MessagingsService) {
    return MessagingsService.get({
      messagingId: $stateParams.messagingId
    }).$promise;
  }

  newMessaging.$inject = ['MessagingsService'];

  function newMessaging(MessagingsService) {
    return new MessagingsService();
  }
}());
