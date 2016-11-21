'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  NumberInsight = mongoose.model('NumberInsight'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Number insight
 */
exports.create = function(req, res) {
  var numberInsight = new NumberInsight(req.body);
  numberInsight.user = req.user;

  numberInsight.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(numberInsight);
    }
  });
};

/**
 * Show the current Number insight
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var numberInsight = req.numberInsight ? req.numberInsight.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  numberInsight.isCurrentUserOwner = req.user && numberInsight.user && numberInsight.user._id.toString() === req.user._id.toString();

  res.jsonp(numberInsight);
};

/**
 * Update a Number insight
 */
exports.update = function(req, res) {
  var numberInsight = req.numberInsight;

  numberInsight = _.extend(numberInsight, req.body);

  numberInsight.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(numberInsight);
    }
  });
};

/**
 * Delete an Number insight
 */
exports.delete = function(req, res) {
  var numberInsight = req.numberInsight;

  numberInsight.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(numberInsight);
    }
  });
};

/**
 * List of Number insights
 */
exports.list = function(req, res) {
  NumberInsight.find().sort('-created').populate('user', 'displayName').exec(function(err, numberInsights) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(numberInsights);
    }
  });
};

/**
 * Number insight middleware
 */
exports.numberInsightByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Number insight is invalid'
    });
  }

  NumberInsight.findById(id).populate('user', 'displayName').exec(function (err, numberInsight) {
    if (err) {
      return next(err);
    } else if (!numberInsight) {
      return res.status(404).send({
        message: 'No Number insight with that identifier has been found'
      });
    }
    req.numberInsight = numberInsight;
    next();
  });
};
