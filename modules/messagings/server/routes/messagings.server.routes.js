'use strict';

/**
 * Module dependencies
 */
var messagingsPolicy = require('../policies/messagings.server.policy'),
  messagings = require('../controllers/messagings.server.controller');

module.exports = function(app) {
  // Messagings Routes
  app.route('/api/messagings').all(messagingsPolicy.isAllowed)
    .get(messagings.list)
    .post(messagings.create);

  app.route('/api/messagings/:messagingId').all(messagingsPolicy.isAllowed)
    .get(messagings.read)
    .put(messagings.update)
    .delete(messagings.delete);

  // Finish by binding the Messaging middleware
  app.param('messagingId', messagings.messagingByID);
};
