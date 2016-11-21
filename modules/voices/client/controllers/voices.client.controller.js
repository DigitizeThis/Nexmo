(function () {
  'use strict';

  // Voices controller
  angular
    .module('voices')
    .controller('VoicesController', VoicesController);

  VoicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'voiceResolve'];

  function VoicesController ($scope, $state, $window, Authentication, voice) {
    var vm = this;

    vm.authentication = Authentication;
    vm.voice = voice;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Voice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.voice.$remove($state.go('voices.list'));
      }
    }

    // Save Voice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.voiceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.voice._id) {
        vm.voice.$update(successCallback, errorCallback);
      } else {
        vm.voice.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('voices.view', {
          voiceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
