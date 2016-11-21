'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  PhoneVerification = mongoose.model('PhoneVerification'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  phoneVerification;

/**
 * Phone verification routes tests
 */
describe('Phone verification CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Phone verification
    user.save(function () {
      phoneVerification = {
        name: 'Phone verification name'
      };

      done();
    });
  });

  it('should be able to save a Phone verification if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phone verification
        agent.post('/api/phoneVerifications')
          .send(phoneVerification)
          .expect(200)
          .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
            // Handle Phone verification save error
            if (phoneVerificationSaveErr) {
              return done(phoneVerificationSaveErr);
            }

            // Get a list of Phone verifications
            agent.get('/api/phoneVerifications')
              .end(function (phoneVerificationsGetErr, phoneVerificationsGetRes) {
                // Handle Phone verifications save error
                if (phoneVerificationsGetErr) {
                  return done(phoneVerificationsGetErr);
                }

                // Get Phone verifications list
                var phoneVerifications = phoneVerificationsGetRes.body;

                // Set assertions
                (phoneVerifications[0].user._id).should.equal(userId);
                (phoneVerifications[0].name).should.match('Phone verification name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Phone verification if not logged in', function (done) {
    agent.post('/api/phoneVerifications')
      .send(phoneVerification)
      .expect(403)
      .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
        // Call the assertion callback
        done(phoneVerificationSaveErr);
      });
  });

  it('should not be able to save an Phone verification if no name is provided', function (done) {
    // Invalidate name field
    phoneVerification.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phone verification
        agent.post('/api/phoneVerifications')
          .send(phoneVerification)
          .expect(400)
          .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
            // Set message assertion
            (phoneVerificationSaveRes.body.message).should.match('Please fill Phone verification name');

            // Handle Phone verification save error
            done(phoneVerificationSaveErr);
          });
      });
  });

  it('should be able to update an Phone verification if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phone verification
        agent.post('/api/phoneVerifications')
          .send(phoneVerification)
          .expect(200)
          .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
            // Handle Phone verification save error
            if (phoneVerificationSaveErr) {
              return done(phoneVerificationSaveErr);
            }

            // Update Phone verification name
            phoneVerification.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Phone verification
            agent.put('/api/phoneVerifications/' + phoneVerificationSaveRes.body._id)
              .send(phoneVerification)
              .expect(200)
              .end(function (phoneVerificationUpdateErr, phoneVerificationUpdateRes) {
                // Handle Phone verification update error
                if (phoneVerificationUpdateErr) {
                  return done(phoneVerificationUpdateErr);
                }

                // Set assertions
                (phoneVerificationUpdateRes.body._id).should.equal(phoneVerificationSaveRes.body._id);
                (phoneVerificationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Phone verifications if not signed in', function (done) {
    // Create new Phone verification model instance
    var phoneVerificationObj = new PhoneVerification(phoneVerification);

    // Save the phoneVerification
    phoneVerificationObj.save(function () {
      // Request Phone verifications
      request(app).get('/api/phoneVerifications')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Phone verification if not signed in', function (done) {
    // Create new Phone verification model instance
    var phoneVerificationObj = new PhoneVerification(phoneVerification);

    // Save the Phone verification
    phoneVerificationObj.save(function () {
      request(app).get('/api/phoneVerifications/' + phoneVerificationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', phoneVerification.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Phone verification with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/phoneVerifications/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Phone verification is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Phone verification which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Phone verification
    request(app).get('/api/phoneVerifications/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Phone verification with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Phone verification if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Phone verification
        agent.post('/api/phoneVerifications')
          .send(phoneVerification)
          .expect(200)
          .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
            // Handle Phone verification save error
            if (phoneVerificationSaveErr) {
              return done(phoneVerificationSaveErr);
            }

            // Delete an existing Phone verification
            agent.delete('/api/phoneVerifications/' + phoneVerificationSaveRes.body._id)
              .send(phoneVerification)
              .expect(200)
              .end(function (phoneVerificationDeleteErr, phoneVerificationDeleteRes) {
                // Handle phoneVerification error error
                if (phoneVerificationDeleteErr) {
                  return done(phoneVerificationDeleteErr);
                }

                // Set assertions
                (phoneVerificationDeleteRes.body._id).should.equal(phoneVerificationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Phone verification if not signed in', function (done) {
    // Set Phone verification user
    phoneVerification.user = user;

    // Create new Phone verification model instance
    var phoneVerificationObj = new PhoneVerification(phoneVerification);

    // Save the Phone verification
    phoneVerificationObj.save(function () {
      // Try deleting Phone verification
      request(app).delete('/api/phoneVerifications/' + phoneVerificationObj._id)
        .expect(403)
        .end(function (phoneVerificationDeleteErr, phoneVerificationDeleteRes) {
          // Set message assertion
          (phoneVerificationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Phone verification error error
          done(phoneVerificationDeleteErr);
        });

    });
  });

  it('should be able to get a single Phone verification that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Phone verification
          agent.post('/api/phoneVerifications')
            .send(phoneVerification)
            .expect(200)
            .end(function (phoneVerificationSaveErr, phoneVerificationSaveRes) {
              // Handle Phone verification save error
              if (phoneVerificationSaveErr) {
                return done(phoneVerificationSaveErr);
              }

              // Set assertions on new Phone verification
              (phoneVerificationSaveRes.body.name).should.equal(phoneVerification.name);
              should.exist(phoneVerificationSaveRes.body.user);
              should.equal(phoneVerificationSaveRes.body.user._id, orphanId);

              // force the Phone verification to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Phone verification
                    agent.get('/api/phoneVerifications/' + phoneVerificationSaveRes.body._id)
                      .expect(200)
                      .end(function (phoneVerificationInfoErr, phoneVerificationInfoRes) {
                        // Handle Phone verification error
                        if (phoneVerificationInfoErr) {
                          return done(phoneVerificationInfoErr);
                        }

                        // Set assertions
                        (phoneVerificationInfoRes.body._id).should.equal(phoneVerificationSaveRes.body._id);
                        (phoneVerificationInfoRes.body.name).should.equal(phoneVerification.name);
                        should.equal(phoneVerificationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      PhoneVerification.remove().exec(done);
    });
  });
});
