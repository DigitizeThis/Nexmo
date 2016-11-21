'use strict';

/**
 * Module dependencies
 */
var numberInsightsPolicy = require('../policies/number-insights.server.policy'),
  numberInsights = require('../controllers/number-insights.server.controller');

module.exports = function(app) {
  // Number insights Routes
  app.route('/api/number-insights').all(numberInsightsPolicy.isAllowed)
    .get(numberInsights.list)
    .post(numberInsights.create);

  app.route('/api/number-insights/:numberInsightId').all(numberInsightsPolicy.isAllowed)
    .get(numberInsights.read)
    .put(numberInsights.update)
    .delete(numberInsights.delete);

  // Finish by binding the Number insight middleware
  app.param('numberInsightId', numberInsights.numberInsightByID);
};
