(function () {
  'use strict';

  angular
    .module('phone-verifications')
    .controller('PhoneVerificationsListController', PhoneVerificationsListController);

  PhoneVerificationsListController.$inject = ['PhoneVerificationsService'];

  function PhoneVerificationsListController(PhoneVerificationsService) {
    var vm = this;

    vm.phoneVerifications = PhoneVerificationsService.query();
  }
}());
