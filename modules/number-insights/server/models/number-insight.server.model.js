'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Number insight Schema
 */
var NumberInsightSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Number insight name',
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

mongoose.model('NumberInsight', NumberInsightSchema);
