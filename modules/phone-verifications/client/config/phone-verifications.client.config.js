(function () {
  'use strict';

  angular
    .module('phone-verifications')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Phone verification',
      state: 'phone-verifications',
      type: 'dropdown',
      position: 4,
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'phone-verifications', {
      title: 'List Phone verifications',
      state: 'phone-verifications.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'phone-verifications', {
      title: 'Create Phone verification',
      state: 'phone-verifications.create',
      roles: ['user']
    });
  }
}());
