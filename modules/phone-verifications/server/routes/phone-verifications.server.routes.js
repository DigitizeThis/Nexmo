'use strict';

/**
 * Module dependencies
 */
var phoneVerificationsPolicy = require('../policies/phone-verifications.server.policy'),
  phoneVerifications = require('../controllers/phone-verifications.server.controller');

module.exports = function(app) {
  // Phone verifications Routes
  app.route('/api/phone-verifications').all(phoneVerificationsPolicy.isAllowed)
    .get(phoneVerifications.list)
    .post(phoneVerifications.create);

  app.route('/api/phone-verifications/:phoneVerificationId').all(phoneVerificationsPolicy.isAllowed)
    .get(phoneVerifications.read)
    .put(phoneVerifications.update)
    .delete(phoneVerifications.delete);

  // Finish by binding the Phone verification middleware
  app.param('phoneVerificationId', phoneVerifications.phoneVerificationByID);
};
