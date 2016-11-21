(function () {
  'use strict';

  // Phone verifications controller
  angular
    .module('phone-verifications')
    .controller('PhoneVerificationsController', PhoneVerificationsController);

  PhoneVerificationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'phoneVerificationResolve'];

  function PhoneVerificationsController ($scope, $state, $window, Authentication, phoneVerification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.phoneVerification = phoneVerification;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Phone verification
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.phoneVerification.$remove($state.go('phone-verifications.list'));
      }
    }

    // Save Phone verification
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.phoneVerificationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.phoneVerification._id) {
        vm.phoneVerification.$update(successCallback, errorCallback);
      } else {
        vm.phoneVerification.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('phone-verifications.view', {
          phoneVerificationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
