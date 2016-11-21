'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Phone verifications Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/phone-verifications',
      permissions: '*'
    }, {
      resources: '/api/phone-verifications/:phoneVerificationId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/phone-verifications',
      permissions: ['get', 'post']
    }, {
      resources: '/api/phone-verifications/:phoneVerificationId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/phone-verifications',
      permissions: ['get']
    }, {
      resources: '/api/phone-verifications/:phoneVerificationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Phone verifications Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Phone verification is being processed and the current user created it then allow any manipulation
  if (req.phoneVerification && req.user && req.phoneVerification.user && req.phoneVerification.user.id === req.user.id) {
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
