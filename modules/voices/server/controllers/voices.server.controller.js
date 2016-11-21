'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Voice = mongoose.model('Voice'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Voice
 */
exports.create = function(req, res) {
  var voice = new Voice(req.body);
  voice.user = req.user;

  voice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(voice);
    }
  });
};

/**
 * Show the current Voice
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var voice = req.voice ? req.voice.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  voice.isCurrentUserOwner = req.user && voice.user && voice.user._id.toString() === req.user._id.toString();

  res.jsonp(voice);
};

/**
 * Update a Voice
 */
exports.update = function(req, res) {
  var voice = req.voice;

  voice = _.extend(voice, req.body);

  voice.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(voice);
    }
  });
};

/**
 * Delete an Voice
 */
exports.delete = function(req, res) {
  var voice = req.voice;

  voice.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(voice);
    }
  });
};

/**
 * List of Voices
 */
exports.list = function(req, res) {
  Voice.find().sort('-created').populate('user', 'displayName').exec(function(err, voices) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(voices);
    }
  });
};

/**
 * Voice middleware
 */
exports.voiceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Voice is invalid'
    });
  }

  Voice.findById(id).populate('user', 'displayName').exec(function (err, voice) {
    if (err) {
      return next(err);
    } else if (!voice) {
      return res.status(404).send({
        message: 'No Voice with that identifier has been found'
      });
    }
    req.voice = voice;
    next();
  });
};
