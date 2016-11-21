(function () {
  'use strict';

  angular
    .module('voices')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('voices', {
        abstract: true,
        url: '/voices',
        template: '<ui-view/>'
      })
      .state('voices.list', {
        url: '',
        templateUrl: 'modules/voices/client/views/list-voices.client.view.html',
        controller: 'VoicesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Voices List'
        }
      })
      .state('voices.create', {
        url: '/create',
        templateUrl: 'modules/voices/client/views/form-voice.client.view.html',
        controller: 'VoicesController',
        controllerAs: 'vm',
        resolve: {
          voiceResolve: newVoice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Voices Create'
        }
      })
      .state('voices.edit', {
        url: '/:voiceId/edit',
        templateUrl: 'modules/voices/client/views/form-voice.client.view.html',
        controller: 'VoicesController',
        controllerAs: 'vm',
        resolve: {
          voiceResolve: getVoice
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Voice {{ voiceResolve.name }}'
        }
      })
      .state('voices.view', {
        url: '/:voiceId',
        templateUrl: 'modules/voices/client/views/view-voice.client.view.html',
        controller: 'VoicesController',
        controllerAs: 'vm',
        resolve: {
          voiceResolve: getVoice
        },
        data: {
          pageTitle: 'Voice {{ voiceResolve.name }}'
        }
      });
  }

  getVoice.$inject = ['$stateParams', 'VoicesService'];

  function getVoice($stateParams, VoicesService) {
    return VoicesService.get({
      voiceId: $stateParams.voiceId
    }).$promise;
  }

  newVoice.$inject = ['VoicesService'];

  function newVoice(VoicesService) {
    return new VoicesService();
  }
}());
