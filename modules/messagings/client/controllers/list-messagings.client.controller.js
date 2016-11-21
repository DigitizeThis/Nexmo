(function () {
  'use strict';

  angular
    .module('messagings')
    .controller('MessagingsListController', MessagingsListController);

  MessagingsListController.$inject = ['MessagingsService'];

  function MessagingsListController(MessagingsService) {
    var vm = this;

    vm.messagings = MessagingsService.query();
  }
}());
