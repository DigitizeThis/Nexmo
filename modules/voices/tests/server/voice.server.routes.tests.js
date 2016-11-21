'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Voice = mongoose.model('Voice'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  voice;

/**
 * Voice routes tests
 */
describe('Voice CRUD tests', function () {

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

    // Save a user to the test db and create new Voice
    user.save(function () {
      voice = {
        name: 'Voice name'
      };

      done();
    });
  });

  it('should be able to save a Voice if logged in', function (done) {
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

        // Save a new Voice
        agent.post('/api/voices')
          .send(voice)
          .expect(200)
          .end(function (voiceSaveErr, voiceSaveRes) {
            // Handle Voice save error
            if (voiceSaveErr) {
              return done(voiceSaveErr);
            }

            // Get a list of Voices
            agent.get('/api/voices')
              .end(function (voicesGetErr, voicesGetRes) {
                // Handle Voices save error
                if (voicesGetErr) {
                  return done(voicesGetErr);
                }

                // Get Voices list
                var voices = voicesGetRes.body;

                // Set assertions
                (voices[0].user._id).should.equal(userId);
                (voices[0].name).should.match('Voice name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Voice if not logged in', function (done) {
    agent.post('/api/voices')
      .send(voice)
      .expect(403)
      .end(function (voiceSaveErr, voiceSaveRes) {
        // Call the assertion callback
        done(voiceSaveErr);
      });
  });

  it('should not be able to save an Voice if no name is provided', function (done) {
    // Invalidate name field
    voice.name = '';

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

        // Save a new Voice
        agent.post('/api/voices')
          .send(voice)
          .expect(400)
          .end(function (voiceSaveErr, voiceSaveRes) {
            // Set message assertion
            (voiceSaveRes.body.message).should.match('Please fill Voice name');

            // Handle Voice save error
            done(voiceSaveErr);
          });
      });
  });

  it('should be able to update an Voice if signed in', function (done) {
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

        // Save a new Voice
        agent.post('/api/voices')
          .send(voice)
          .expect(200)
          .end(function (voiceSaveErr, voiceSaveRes) {
            // Handle Voice save error
            if (voiceSaveErr) {
              return done(voiceSaveErr);
            }

            // Update Voice name
            voice.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Voice
            agent.put('/api/voices/' + voiceSaveRes.body._id)
              .send(voice)
              .expect(200)
              .end(function (voiceUpdateErr, voiceUpdateRes) {
                // Handle Voice update error
                if (voiceUpdateErr) {
                  return done(voiceUpdateErr);
                }

                // Set assertions
                (voiceUpdateRes.body._id).should.equal(voiceSaveRes.body._id);
                (voiceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Voices if not signed in', function (done) {
    // Create new Voice model instance
    var voiceObj = new Voice(voice);

    // Save the voice
    voiceObj.save(function () {
      // Request Voices
      request(app).get('/api/voices')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Voice if not signed in', function (done) {
    // Create new Voice model instance
    var voiceObj = new Voice(voice);

    // Save the Voice
    voiceObj.save(function () {
      request(app).get('/api/voices/' + voiceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', voice.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Voice with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/voices/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Voice is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Voice which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Voice
    request(app).get('/api/voices/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Voice with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Voice if signed in', function (done) {
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

        // Save a new Voice
        agent.post('/api/voices')
          .send(voice)
          .expect(200)
          .end(function (voiceSaveErr, voiceSaveRes) {
            // Handle Voice save error
            if (voiceSaveErr) {
              return done(voiceSaveErr);
            }

            // Delete an existing Voice
            agent.delete('/api/voices/' + voiceSaveRes.body._id)
              .send(voice)
              .expect(200)
              .end(function (voiceDeleteErr, voiceDeleteRes) {
                // Handle voice error error
                if (voiceDeleteErr) {
                  return done(voiceDeleteErr);
                }

                // Set assertions
                (voiceDeleteRes.body._id).should.equal(voiceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Voice if not signed in', function (done) {
    // Set Voice user
    voice.user = user;

    // Create new Voice model instance
    var voiceObj = new Voice(voice);

    // Save the Voice
    voiceObj.save(function () {
      // Try deleting Voice
      request(app).delete('/api/voices/' + voiceObj._id)
        .expect(403)
        .end(function (voiceDeleteErr, voiceDeleteRes) {
          // Set message assertion
          (voiceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Voice error error
          done(voiceDeleteErr);
        });

    });
  });

  it('should be able to get a single Voice that has an orphaned user reference', function (done) {
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

          // Save a new Voice
          agent.post('/api/voices')
            .send(voice)
            .expect(200)
            .end(function (voiceSaveErr, voiceSaveRes) {
              // Handle Voice save error
              if (voiceSaveErr) {
                return done(voiceSaveErr);
              }

              // Set assertions on new Voice
              (voiceSaveRes.body.name).should.equal(voice.name);
              should.exist(voiceSaveRes.body.user);
              should.equal(voiceSaveRes.body.user._id, orphanId);

              // force the Voice to have an orphaned user reference
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

                    // Get the Voice
                    agent.get('/api/voices/' + voiceSaveRes.body._id)
                      .expect(200)
                      .end(function (voiceInfoErr, voiceInfoRes) {
                        // Handle Voice error
                        if (voiceInfoErr) {
                          return done(voiceInfoErr);
                        }

                        // Set assertions
                        (voiceInfoRes.body._id).should.equal(voiceSaveRes.body._id);
                        (voiceInfoRes.body.name).should.equal(voice.name);
                        should.equal(voiceInfoRes.body.user, undefined);

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
      Voice.remove().exec(done);
    });
  });
});
