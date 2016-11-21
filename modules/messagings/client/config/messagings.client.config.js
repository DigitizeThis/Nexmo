(function () {
  'use strict';

  angular
    .module('messagings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Messaging',
      state: 'messagings',
      type: 'dropdown',
      position: 2,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'messagings', {
      title: 'List Messagings',
      state: 'messagings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'messagings', {
      title: 'Create Messaging',
      state: 'messagings.create',
      roles: ['user']
    });
  }
}());
