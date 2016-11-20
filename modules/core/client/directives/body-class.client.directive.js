(function () {
  'use strict';

  angular
    .module('core')
    .directive('bodyClass', bodyClass);

  bodyClass.$inject = ['$rootScope', '$state'];

  function bodyClass ($rootScope, $state) {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        var previous = '';
        $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

        function stateChangeSuccess (event, currentRoute) {
          var route = currentRoute.$$route;
          if (route) {
            var cls = route.class;
            if (previous) {
              attr.$removeClass(previous);
            }
            if (cls) {
              previous = cls;
              attr.$addClass(cls);
            }
          }
        }
      }
    };
  }
}());
