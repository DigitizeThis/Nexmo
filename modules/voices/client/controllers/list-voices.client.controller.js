(function () {
  'use strict';

  angular
    .module('voices')
    .controller('VoicesListController', VoicesListController);

  VoicesListController.$inject = ['VoicesService'];

  function VoicesListController(VoicesService) {
    var vm = this;

    vm.voices = VoicesService.query();
  }
}());
