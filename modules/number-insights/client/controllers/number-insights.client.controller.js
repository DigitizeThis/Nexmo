(function () {
  'use strict';

  // Number insights controller
  angular
    .module('number-insights')
    .controller('NumberInsightsController', NumberInsightsController);

  NumberInsightsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'numberInsightResolve'];

  function NumberInsightsController ($scope, $state, $window, Authentication, numberInsight) {
    var vm = this;

    vm.authentication = Authentication;
    vm.numberInsight = numberInsight;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Number insight
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.numberInsight.$remove($state.go('number-insights.list'));
      }
    }

    // Save Number insight
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.numberInsightForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.numberInsight._id) {
        vm.numberInsight.$update(successCallback, errorCallback);
      } else {
        vm.numberInsight.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('number-insights.view', {
          numberInsightId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
