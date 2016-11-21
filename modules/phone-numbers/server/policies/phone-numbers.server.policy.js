'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Phone numbers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/phone-numbers',
      permissions: '*'
    }, {
      resources: '/api/phone-numbers/:phoneNumberId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/phone-numbers',
      permissions: ['get', 'post']
    }, {
      resources: '/api/phone-numbers/:phoneNumberId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/phone-numbers',
      permissions: ['get']
    }, {
      resources: '/api/phone-numbers/:phoneNumberId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Phone numbers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Phone number is being processed and the current user created it then allow any manipulation
  if (req.phoneNumber && req.user && req.phoneNumber.user && req.phoneNumber.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
