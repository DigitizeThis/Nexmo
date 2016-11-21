(function () {
  'use strict';

  angular
    .module('phone-numbers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('phone-numbers', {
        abstract: true,
        url: '/phone-numbers',
        template: '<ui-view/>'
      })
      .state('phone-numbers.list', {
        url: '',
        templateUrl: 'modules/phone-numbers/client/views/list-phone-numbers.client.view.html',
        controller: 'PhoneNumbersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Phone numbers List'
        }
      })
      .state('phone-numbers.create', {
        url: '/create',
        templateUrl: 'modules/phone-numbers/client/views/form-phone-number.client.view.html',
        controller: 'PhoneNumbersController',
        controllerAs: 'vm',
        resolve: {
          phoneNumberResolve: newPhoneNumber
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Phone numbers Create'
        }
      })
      .state('phone-numbers.edit', {
        url: '/:phoneNumberId/edit',
        templateUrl: 'modules/phone-numbers/client/views/form-phone-number.client.view.html',
        controller: 'PhoneNumbersController',
        controllerAs: 'vm',
        resolve: {
          phoneNumberResolve: getPhoneNumber
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Phone number {{ phoneNumberResolve.name }}'
        }
      })
      .state('phone-numbers.view', {
        url: '/:phoneNumberId',
        templateUrl: 'modules/phone-numbers/client/views/view-phone-number.client.view.html',
        controller: 'PhoneNumbersController',
        controllerAs: 'vm',
        resolve: {
          phoneNumberResolve: getPhoneNumber
        },
        data: {
          pageTitle: 'Phone number {{ phoneNumberResolve.name }}'
        }
      });
  }

  getPhoneNumber.$inject = ['$stateParams', 'PhoneNumbersService'];

  function getPhoneNumber($stateParams, PhoneNumbersService) {
    return PhoneNumbersService.get({
      phoneNumberId: $stateParams.phoneNumberId
    }).$promise;
  }

  newPhoneNumber.$inject = ['PhoneNumbersService'];

  function newPhoneNumber(PhoneNumbersService) {
    return new PhoneNumbersService();
  }
}());
