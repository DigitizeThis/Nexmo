(function () {
  'use strict';

  angular
    .module('phone-verifications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('phone-verifications', {
        abstract: true,
        url: '/phone-verifications',
        template: '<ui-view/>'
      })
      .state('phone-verifications.list', {
        url: '',
        templateUrl: 'modules/phone-verifications/client/views/list-phone-verifications.client.view.html',
        controller: 'PhoneVerificationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Phone verifications List'
        }
      })
      .state('phone-verifications.create', {
        url: '/create',
        templateUrl: 'modules/phone-verifications/client/views/form-phone-verification.client.view.html',
        controller: 'PhoneVerificationsController',
        controllerAs: 'vm',
        resolve: {
          phoneVerificationResolve: newPhoneVerification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Phone verifications Create'
        }
      })
      .state('phone-verifications.edit', {
        url: '/:phoneVerificationId/edit',
        templateUrl: 'modules/phone-verifications/client/views/form-phone-verification.client.view.html',
        controller: 'PhoneVerificationsController',
        controllerAs: 'vm',
        resolve: {
          phoneVerificationResolve: getPhoneVerification
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Phone verification {{ phoneVerificationResolve.name }}'
        }
      })
      .state('phone-verifications.view', {
        url: '/:phoneVerificationId',
        templateUrl: 'modules/phone-verifications/client/views/view-phone-verification.client.view.html',
        controller: 'PhoneVerificationsController',
        controllerAs: 'vm',
        resolve: {
          phoneVerificationResolve: getPhoneVerification
        },
        data: {
          pageTitle: 'Phone verification {{ phoneVerificationResolve.name }}'
        }
      });
  }

  getPhoneVerification.$inject = ['$stateParams', 'PhoneVerificationsService'];

  function getPhoneVerification($stateParams, PhoneVerificationsService) {
    return PhoneVerificationsService.get({
      phoneVerificationId: $stateParams.phoneVerificationId
    }).$promise;
  }

  newPhoneVerification.$inject = ['PhoneVerificationsService'];

  function newPhoneVerification(PhoneVerificationsService) {
    return new PhoneVerificationsService();
  }
}());
