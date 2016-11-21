'use strict';

/**
 * Module dependencies
 */
var phoneNumbersPolicy = require('../policies/phone-numbers.server.policy'),
  phoneNumbers = require('../controllers/phone-numbers.server.controller');

module.exports = function(app) {
  // Phone numbers Routes
  app.route('/api/phone-numbers').all(phoneNumbersPolicy.isAllowed)
    .get(phoneNumbers.list)
    .post(phoneNumbers.create);

  app.route('/api/phone-numbers/:phoneNumberId').all(phoneNumbersPolicy.isAllowed)
    .get(phoneNumbers.read)
    .put(phoneNumbers.update)
    .delete(phoneNumbers.delete);

  // Finish by binding the Phone number middleware
  app.param('phoneNumberId', phoneNumbers.phoneNumberByID);
};
