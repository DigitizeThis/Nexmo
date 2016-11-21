'use strict';

/**
 * Module dependencies
 */
var voicesPolicy = require('../policies/voices.server.policy'),
  voices = require('../controllers/voices.server.controller');

module.exports = function(app) {
  // Voices Routes
  app.route('/api/voices').all(voicesPolicy.isAllowed)
    .get(voices.list)
    .post(voices.create);

  app.route('/api/voices/:voiceId').all(voicesPolicy.isAllowed)
    .get(voices.read)
    .put(voices.update)
    .delete(voices.delete);

  // Finish by binding the Voice middleware
  app.param('voiceId', voices.voiceByID);
};
