'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Messaging = mongoose.model('Messaging'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Messaging
 */
exports.create = function(req, res) {
  var messaging = new Messaging(req.body);
  messaging.user = req.user;

  messaging.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messaging);
    }
  });
};

/**
 * Show the current Messaging
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var messaging = req.messaging ? req.messaging.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  messaging.isCurrentUserOwner = req.user && messaging.user && messaging.user._id.toString() === req.user._id.toString();

  res.jsonp(messaging);
};

/**
 * Update a Messaging
 */
exports.update = function(req, res) {
  var messaging = req.messaging;

  messaging = _.extend(messaging, req.body);

  messaging.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messaging);
    }
  });
};

/**
 * Delete an Messaging
 */
exports.delete = function(req, res) {
  var messaging = req.messaging;

  messaging.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messaging);
    }
  });
};

/**
 * List of Messagings
 */
exports.list = function(req, res) {
  Messaging.find().sort('-created').populate('user', 'displayName').exec(function(err, messagings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(messagings);
    }
  });
};

/**
 * Messaging middleware
 */
exports.messagingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Messaging is invalid'
    });
  }

  Messaging.findById(id).populate('user', 'displayName').exec(function (err, messaging) {
    if (err) {
      return next(err);
    } else if (!messaging) {
      return res.status(404).send({
        message: 'No Messaging with that identifier has been found'
      });
    }
    req.messaging = messaging;
    next();
  });
};
