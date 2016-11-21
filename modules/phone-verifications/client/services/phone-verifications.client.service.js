// Phone verifications service used to communicate Phone verifications REST endpoints
(function () {
  'use strict';

  angular
    .module('phone-verifications')
    .factory('PhoneVerificationsService', PhoneVerificationsService);

  PhoneVerificationsService.$inject = ['$resource'];

  function PhoneVerificationsService($resource) {
    return $resource('api/phone-verifications/:phoneVerificationId', {
      phoneVerificationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
