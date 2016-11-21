// Voices service used to communicate Voices REST endpoints
(function () {
  'use strict';

  angular
    .module('voices')
    .factory('VoicesService', VoicesService);

  VoicesService.$inject = ['$resource'];

  function VoicesService($resource) {
    return $resource('api/voices/:voiceId', {
      voiceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
