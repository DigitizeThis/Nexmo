// Number insights service used to communicate Number insights REST endpoints
(function () {
  'use strict';

  angular
    .module('number-insights')
    .factory('NumberInsightsService', NumberInsightsService);

  NumberInsightsService.$inject = ['$resource'];

  function NumberInsightsService($resource) {
    return $resource('api/number-insights/:numberInsightId', {
      numberInsightId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
