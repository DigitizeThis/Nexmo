'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  PhoneNumber = mongoose.model('PhoneNumber'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  phoneNumber;

/**
 * Phone number routes tests
 */
describe('Phone number CRUD tests', function () {

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

    // Save a user to the test db and create new Phone number
    user.save(function () {
      phoneNumber = {
        name: 'Phone number name'
      };

      done();
    });
  });

  it('should be able to save a Phone number if logged in', function (done) {
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

        // Save a new Phone number
        agent.post('/api/phoneNumbers')
          .send(phoneNumber)
          .expect(200)
          .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
            // Handle Phone number save error
            if (phoneNumberSaveErr) {
              return done(phoneNumberSaveErr);
            }

            // Get a list of Phone numbers
            agent.get('/api/phoneNumbers')
              .end(function (phoneNumbersGetErr, phoneNumbersGetRes) {
                // Handle Phone numbers save error
                if (phoneNumbersGetErr) {
                  return done(phoneNumbersGetErr);
                }

                // Get Phone numbers list
                var phoneNumbers = phoneNumbersGetRes.body;

                // Set assertions
                (phoneNumbers[0].user._id).should.equal(userId);
                (phoneNumbers[0].name).should.match('Phone number name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Phone number if not logged in', function (done) {
    agent.post('/api/phoneNumbers')
      .send(phoneNumber)
      .expect(403)
      .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
        // Call the assertion callback
        done(phoneNumberSaveErr);
      });
  });

  it('should not be able to save an Phone number if no name is provided', function (done) {
    // Invalidate name field
    phoneNumber.name = '';

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

        // Save a new Phone number
        agent.post('/api/phoneNumbers')
          .send(phoneNumber)
          .expect(400)
          .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
            // Set message assertion
            (phoneNumberSaveRes.body.message).should.match('Please fill Phone number name');

            // Handle Phone number save error
            done(phoneNumberSaveErr);
          });
      });
  });

  it('should be able to update an Phone number if signed in', function (done) {
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

        // Save a new Phone number
        agent.post('/api/phoneNumbers')
          .send(phoneNumber)
          .expect(200)
          .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
            // Handle Phone number save error
            if (phoneNumberSaveErr) {
              return done(phoneNumberSaveErr);
            }

            // Update Phone number name
            phoneNumber.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Phone number
            agent.put('/api/phoneNumbers/' + phoneNumberSaveRes.body._id)
              .send(phoneNumber)
              .expect(200)
              .end(function (phoneNumberUpdateErr, phoneNumberUpdateRes) {
                // Handle Phone number update error
                if (phoneNumberUpdateErr) {
                  return done(phoneNumberUpdateErr);
                }

                // Set assertions
                (phoneNumberUpdateRes.body._id).should.equal(phoneNumberSaveRes.body._id);
                (phoneNumberUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Phone numbers if not signed in', function (done) {
    // Create new Phone number model instance
    var phoneNumberObj = new PhoneNumber(phoneNumber);

    // Save the phoneNumber
    phoneNumberObj.save(function () {
      // Request Phone numbers
      request(app).get('/api/phoneNumbers')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Phone number if not signed in', function (done) {
    // Create new Phone number model instance
    var phoneNumberObj = new PhoneNumber(phoneNumber);

    // Save the Phone number
    phoneNumberObj.save(function () {
      request(app).get('/api/phoneNumbers/' + phoneNumberObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', phoneNumber.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Phone number with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/phoneNumbers/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Phone number is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Phone number which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Phone number
    request(app).get('/api/phoneNumbers/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Phone number with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Phone number if signed in', function (done) {
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

        // Save a new Phone number
        agent.post('/api/phoneNumbers')
          .send(phoneNumber)
          .expect(200)
          .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
            // Handle Phone number save error
            if (phoneNumberSaveErr) {
              return done(phoneNumberSaveErr);
            }

            // Delete an existing Phone number
            agent.delete('/api/phoneNumbers/' + phoneNumberSaveRes.body._id)
              .send(phoneNumber)
              .expect(200)
              .end(function (phoneNumberDeleteErr, phoneNumberDeleteRes) {
                // Handle phoneNumber error error
                if (phoneNumberDeleteErr) {
                  return done(phoneNumberDeleteErr);
                }

                // Set assertions
                (phoneNumberDeleteRes.body._id).should.equal(phoneNumberSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Phone number if not signed in', function (done) {
    // Set Phone number user
    phoneNumber.user = user;

    // Create new Phone number model instance
    var phoneNumberObj = new PhoneNumber(phoneNumber);

    // Save the Phone number
    phoneNumberObj.save(function () {
      // Try deleting Phone number
      request(app).delete('/api/phoneNumbers/' + phoneNumberObj._id)
        .expect(403)
        .end(function (phoneNumberDeleteErr, phoneNumberDeleteRes) {
          // Set message assertion
          (phoneNumberDeleteRes.body.message).should.match('User is not authorized');

          // Handle Phone number error error
          done(phoneNumberDeleteErr);
        });

    });
  });

  it('should be able to get a single Phone number that has an orphaned user reference', function (done) {
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

          // Save a new Phone number
          agent.post('/api/phoneNumbers')
            .send(phoneNumber)
            .expect(200)
            .end(function (phoneNumberSaveErr, phoneNumberSaveRes) {
              // Handle Phone number save error
              if (phoneNumberSaveErr) {
                return done(phoneNumberSaveErr);
              }

              // Set assertions on new Phone number
              (phoneNumberSaveRes.body.name).should.equal(phoneNumber.name);
              should.exist(phoneNumberSaveRes.body.user);
              should.equal(phoneNumberSaveRes.body.user._id, orphanId);

              // force the Phone number to have an orphaned user reference
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

                    // Get the Phone number
                    agent.get('/api/phoneNumbers/' + phoneNumberSaveRes.body._id)
                      .expect(200)
                      .end(function (phoneNumberInfoErr, phoneNumberInfoRes) {
                        // Handle Phone number error
                        if (phoneNumberInfoErr) {
                          return done(phoneNumberInfoErr);
                        }

                        // Set assertions
                        (phoneNumberInfoRes.body._id).should.equal(phoneNumberSaveRes.body._id);
                        (phoneNumberInfoRes.body.name).should.equal(phoneNumber.name);
                        should.equal(phoneNumberInfoRes.body.user, undefined);

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
      PhoneNumber.remove().exec(done);
    });
  });
});
