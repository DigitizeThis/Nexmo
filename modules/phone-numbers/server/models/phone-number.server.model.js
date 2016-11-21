'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Phone number Schema
 */
var PhoneNumberSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Phone number name',
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

mongoose.model('PhoneNumber', PhoneNumberSchema);
