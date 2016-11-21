'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Number insights Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/number-insights',
      permissions: '*'
    }, {
      resources: '/api/number-insights/:numberInsightId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/number-insights',
      permissions: ['get', 'post']
    }, {
      resources: '/api/number-insights/:numberInsightId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/number-insights',
      permissions: ['get']
    }, {
      resources: '/api/number-insights/:numberInsightId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Number insights Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Number insight is being processed and the current user created it then allow any manipulation
  if (req.numberInsight && req.user && req.numberInsight.user && req.numberInsight.user.id === req.user.id) {
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
