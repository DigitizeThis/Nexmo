'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  NumberInsight = mongoose.model('NumberInsight');

/**
 * Globals
 */
var user,
  numberInsight;

/**
 * Unit tests
 */
describe('Number insight Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      numberInsight = new NumberInsight({
        name: 'Number insight Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return numberInsight.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      numberInsight.name = '';

      return numberInsight.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    NumberInsight.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
