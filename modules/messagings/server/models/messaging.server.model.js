'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Messaging Schema
 */
var MessagingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Messaging name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Messaging', MessagingSchema);
