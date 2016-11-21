(function () {
  'use strict';

  angular
    .module('number-insights')
    .controller('NumberInsightsListController', NumberInsightsListController);

  NumberInsightsListController.$inject = ['NumberInsightsService'];

  function NumberInsightsListController(NumberInsightsService) {
    var vm = this;

    vm.numberInsights = NumberInsightsService.query();
  }
}());
