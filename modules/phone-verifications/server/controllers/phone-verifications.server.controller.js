'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PhoneVerification = mongoose.model('PhoneVerification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Phone verification
 */
exports.create = function(req, res) {
  var phoneVerification = new PhoneVerification(req.body);
  phoneVerification.user = req.user;

  phoneVerification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneVerification);
    }
  });
};

/**
 * Show the current Phone verification
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var phoneVerification = req.phoneVerification ? req.phoneVerification.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  phoneVerification.isCurrentUserOwner = req.user && phoneVerification.user && phoneVerification.user._id.toString() === req.user._id.toString();

  res.jsonp(phoneVerification);
};

/**
 * Update a Phone verification
 */
exports.update = function(req, res) {
  var phoneVerification = req.phoneVerification;

  phoneVerification = _.extend(phoneVerification, req.body);

  phoneVerification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneVerification);
    }
  });
};

/**
 * Delete an Phone verification
 */
exports.delete = function(req, res) {
  var phoneVerification = req.phoneVerification;

  phoneVerification.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneVerification);
    }
  });
};

/**
 * List of Phone verifications
 */
exports.list = function(req, res) {
  PhoneVerification.find().sort('-created').populate('user', 'displayName').exec(function(err, phoneVerifications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneVerifications);
    }
  });
};

/**
 * Phone verification middleware
 */
exports.phoneVerificationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Phone verification is invalid'
    });
  }

  PhoneVerification.findById(id).populate('user', 'displayName').exec(function (err, phoneVerification) {
    if (err) {
      return next(err);
    } else if (!phoneVerification) {
      return res.status(404).send({
        message: 'No Phone verification with that identifier has been found'
      });
    }
    req.phoneVerification = phoneVerification;
    next();
  });
};
