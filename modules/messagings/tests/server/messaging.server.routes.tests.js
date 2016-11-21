'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Messaging = mongoose.model('Messaging'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  messaging;

/**
 * Messaging routes tests
 */
describe('Messaging CRUD tests', function () {

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

    // Save a user to the test db and create new Messaging
    user.save(function () {
      messaging = {
        name: 'Messaging name'
      };

      done();
    });
  });

  it('should be able to save a Messaging if logged in', function (done) {
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

        // Save a new Messaging
        agent.post('/api/messagings')
          .send(messaging)
          .expect(200)
          .end(function (messagingSaveErr, messagingSaveRes) {
            // Handle Messaging save error
            if (messagingSaveErr) {
              return done(messagingSaveErr);
            }

            // Get a list of Messagings
            agent.get('/api/messagings')
              .end(function (messagingsGetErr, messagingsGetRes) {
                // Handle Messagings save error
                if (messagingsGetErr) {
                  return done(messagingsGetErr);
                }

                // Get Messagings list
                var messagings = messagingsGetRes.body;

                // Set assertions
                (messagings[0].user._id).should.equal(userId);
                (messagings[0].name).should.match('Messaging name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Messaging if not logged in', function (done) {
    agent.post('/api/messagings')
      .send(messaging)
      .expect(403)
      .end(function (messagingSaveErr, messagingSaveRes) {
        // Call the assertion callback
        done(messagingSaveErr);
      });
  });

  it('should not be able to save an Messaging if no name is provided', function (done) {
    // Invalidate name field
    messaging.name = '';

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

        // Save a new Messaging
        agent.post('/api/messagings')
          .send(messaging)
          .expect(400)
          .end(function (messagingSaveErr, messagingSaveRes) {
            // Set message assertion
            (messagingSaveRes.body.message).should.match('Please fill Messaging name');

            // Handle Messaging save error
            done(messagingSaveErr);
          });
      });
  });

  it('should be able to update an Messaging if signed in', function (done) {
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

        // Save a new Messaging
        agent.post('/api/messagings')
          .send(messaging)
          .expect(200)
          .end(function (messagingSaveErr, messagingSaveRes) {
            // Handle Messaging save error
            if (messagingSaveErr) {
              return done(messagingSaveErr);
            }

            // Update Messaging name
            messaging.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Messaging
            agent.put('/api/messagings/' + messagingSaveRes.body._id)
              .send(messaging)
              .expect(200)
              .end(function (messagingUpdateErr, messagingUpdateRes) {
                // Handle Messaging update error
                if (messagingUpdateErr) {
                  return done(messagingUpdateErr);
                }

                // Set assertions
                (messagingUpdateRes.body._id).should.equal(messagingSaveRes.body._id);
                (messagingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Messagings if not signed in', function (done) {
    // Create new Messaging model instance
    var messagingObj = new Messaging(messaging);

    // Save the messaging
    messagingObj.save(function () {
      // Request Messagings
      request(app).get('/api/messagings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Messaging if not signed in', function (done) {
    // Create new Messaging model instance
    var messagingObj = new Messaging(messaging);

    // Save the Messaging
    messagingObj.save(function () {
      request(app).get('/api/messagings/' + messagingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', messaging.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Messaging with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/messagings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Messaging is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Messaging which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Messaging
    request(app).get('/api/messagings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Messaging with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Messaging if signed in', function (done) {
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

        // Save a new Messaging
        agent.post('/api/messagings')
          .send(messaging)
          .expect(200)
          .end(function (messagingSaveErr, messagingSaveRes) {
            // Handle Messaging save error
            if (messagingSaveErr) {
              return done(messagingSaveErr);
            }

            // Delete an existing Messaging
            agent.delete('/api/messagings/' + messagingSaveRes.body._id)
              .send(messaging)
              .expect(200)
              .end(function (messagingDeleteErr, messagingDeleteRes) {
                // Handle messaging error error
                if (messagingDeleteErr) {
                  return done(messagingDeleteErr);
                }

                // Set assertions
                (messagingDeleteRes.body._id).should.equal(messagingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Messaging if not signed in', function (done) {
    // Set Messaging user
    messaging.user = user;

    // Create new Messaging model instance
    var messagingObj = new Messaging(messaging);

    // Save the Messaging
    messagingObj.save(function () {
      // Try deleting Messaging
      request(app).delete('/api/messagings/' + messagingObj._id)
        .expect(403)
        .end(function (messagingDeleteErr, messagingDeleteRes) {
          // Set message assertion
          (messagingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Messaging error error
          done(messagingDeleteErr);
        });

    });
  });

  it('should be able to get a single Messaging that has an orphaned user reference', function (done) {
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

          // Save a new Messaging
          agent.post('/api/messagings')
            .send(messaging)
            .expect(200)
            .end(function (messagingSaveErr, messagingSaveRes) {
              // Handle Messaging save error
              if (messagingSaveErr) {
                return done(messagingSaveErr);
              }

              // Set assertions on new Messaging
              (messagingSaveRes.body.name).should.equal(messaging.name);
              should.exist(messagingSaveRes.body.user);
              should.equal(messagingSaveRes.body.user._id, orphanId);

              // force the Messaging to have an orphaned user reference
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

                    // Get the Messaging
                    agent.get('/api/messagings/' + messagingSaveRes.body._id)
                      .expect(200)
                      .end(function (messagingInfoErr, messagingInfoRes) {
                        // Handle Messaging error
                        if (messagingInfoErr) {
                          return done(messagingInfoErr);
                        }

                        // Set assertions
                        (messagingInfoRes.body._id).should.equal(messagingSaveRes.body._id);
                        (messagingInfoRes.body.name).should.equal(messaging.name);
                        should.equal(messagingInfoRes.body.user, undefined);

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
      Messaging.remove().exec(done);
    });
  });
});
