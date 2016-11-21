(function () {
  'use strict';

  // Messagings controller
  angular
    .module('messagings')
    .controller('MessagingsController', MessagingsController);

  MessagingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'messagingResolve'];

  function MessagingsController ($scope, $state, $window, Authentication, messaging) {
    var vm = this;

    vm.authentication = Authentication;
    vm.messaging = messaging;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Messaging
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.messaging.$remove($state.go('messagings.list'));
      }
    }

    // Save Messaging
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.messagingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.messaging._id) {
        vm.messaging.$update(successCallback, errorCallback);
      } else {
        vm.messaging.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('messagings.view', {
          messagingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
