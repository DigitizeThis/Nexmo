(function () {
  'use strict';

  angular
    .module('phone-numbers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Phone numbers',
      state: 'phone-numbers',
      type: 'dropdown',
      position: 6,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'phone-numbers', {
      title: 'List Phone numbers',
      state: 'phone-numbers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'phone-numbers', {
      title: 'Create Phone number',
      state: 'phone-numbers.create',
      roles: ['user']
    });
  }
}());
