(function () {
  'use strict';

  angular
    .module('dashboards')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Dashboard',
      state: 'dashboards',
      type: 'dropdown',
      position: 1,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'dashboards', {
      title: 'List Dashboards',
      state: 'dashboards.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'dashboards', {
      title: 'Create Dashboard',
      state: 'dashboards.create',
      roles: ['user']
    });
  }
}());
