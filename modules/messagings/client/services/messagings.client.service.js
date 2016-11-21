// Messagings service used to communicate Messagings REST endpoints
(function () {
  'use strict';

  angular
    .module('messagings')
    .factory('MessagingsService', MessagingsService);

  MessagingsService.$inject = ['$resource'];

  function MessagingsService($resource) {
    return $resource('api/messagings/:messagingId', {
      messagingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
