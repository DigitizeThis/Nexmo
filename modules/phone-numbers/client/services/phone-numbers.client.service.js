// Phone numbers service used to communicate Phone numbers REST endpoints
(function () {
  'use strict';

  angular
    .module('phone-numbers')
    .factory('PhoneNumbersService', PhoneNumbersService);

  PhoneNumbersService.$inject = ['$resource'];

  function PhoneNumbersService($resource) {
    return $resource('api/phone-numbers/:phoneNumberId', {
      phoneNumberId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
