(function () {
  'use strict';

  // Phone numbers controller
  angular
    .module('phone-numbers')
    .controller('PhoneNumbersController', PhoneNumbersController);

  PhoneNumbersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'phoneNumberResolve'];

  function PhoneNumbersController ($scope, $state, $window, Authentication, phoneNumber) {
    var vm = this;

    vm.authentication = Authentication;
    vm.phoneNumber = phoneNumber;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Phone number
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.phoneNumber.$remove($state.go('phone-numbers.list'));
      }
    }

    // Save Phone number
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.phoneNumberForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.phoneNumber._id) {
        vm.phoneNumber.$update(successCallback, errorCallback);
      } else {
        vm.phoneNumber.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('phone-numbers.view', {
          phoneNumberId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
