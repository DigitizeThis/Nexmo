'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Phone verification Schema
 */
var PhoneVerificationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Phone verification name',
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

mongoose.model('PhoneVerification', PhoneVerificationSchema);
