(function () {
  'use strict';

  angular
    .module('number-insights')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Number insight',
      state: 'number-insights',
      type: 'dropdown',
      position: 5,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'number-insights', {
      title: 'List Number insights',
      state: 'number-insights.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'number-insights', {
      title: 'Create Number insight',
      state: 'number-insights.create',
      roles: ['user']
    });
  }
}());
