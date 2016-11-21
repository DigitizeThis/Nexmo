(function () {
  'use strict';

  angular
    .module('phone-numbers')
    .controller('PhoneNumbersListController', PhoneNumbersListController);

  PhoneNumbersListController.$inject = ['PhoneNumbersService'];

  function PhoneNumbersListController(PhoneNumbersService) {
    var vm = this;

    vm.phoneNumbers = PhoneNumbersService.query();
  }
}());
