'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  PhoneNumber = mongoose.model('PhoneNumber'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Phone number
 */
exports.create = function(req, res) {
  var phoneNumber = new PhoneNumber(req.body);
  phoneNumber.user = req.user;

  phoneNumber.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneNumber);
    }
  });
};

/**
 * Show the current Phone number
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var phoneNumber = req.phoneNumber ? req.phoneNumber.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  phoneNumber.isCurrentUserOwner = req.user && phoneNumber.user && phoneNumber.user._id.toString() === req.user._id.toString();

  res.jsonp(phoneNumber);
};

/**
 * Update a Phone number
 */
exports.update = function(req, res) {
  var phoneNumber = req.phoneNumber;

  phoneNumber = _.extend(phoneNumber, req.body);

  phoneNumber.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneNumber);
    }
  });
};

/**
 * Delete an Phone number
 */
exports.delete = function(req, res) {
  var phoneNumber = req.phoneNumber;

  phoneNumber.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneNumber);
    }
  });
};

/**
 * List of Phone numbers
 */
exports.list = function(req, res) {
  PhoneNumber.find().sort('-created').populate('user', 'displayName').exec(function(err, phoneNumbers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(phoneNumbers);
    }
  });
};

/**
 * Phone number middleware
 */
exports.phoneNumberByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Phone number is invalid'
    });
  }

  PhoneNumber.findById(id).populate('user', 'displayName').exec(function (err, phoneNumber) {
    if (err) {
      return next(err);
    } else if (!phoneNumber) {
      return res.status(404).send({
        message: 'No Phone number with that identifier has been found'
      });
    }
    req.phoneNumber = phoneNumber;
    next();
  });
};
