(function () {
  'use strict';

  angular
    .module('voices')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Voice',
      state: 'voices',
      type: 'dropdown',
      position: 3,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'voices', {
      title: 'List Voices',
      state: 'voices.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'voices', {
      title: 'Create Voice',
      state: 'voices.create',
      roles: ['user']
    });
  }
}());
