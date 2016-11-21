'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  NumberInsight = mongoose.model('NumberInsight'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  numberInsight;

/**
 * Number insight routes tests
 */
describe('Number insight CRUD tests', function () {

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

    // Save a user to the test db and create new Number insight
    user.save(function () {
      numberInsight = {
        name: 'Number insight name'
      };

      done();
    });
  });

  it('should be able to save a Number insight if logged in', function (done) {
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

        // Save a new Number insight
        agent.post('/api/numberInsights')
          .send(numberInsight)
          .expect(200)
          .end(function (numberInsightSaveErr, numberInsightSaveRes) {
            // Handle Number insight save error
            if (numberInsightSaveErr) {
              return done(numberInsightSaveErr);
            }

            // Get a list of Number insights
            agent.get('/api/numberInsights')
              .end(function (numberInsightsGetErr, numberInsightsGetRes) {
                // Handle Number insights save error
                if (numberInsightsGetErr) {
                  return done(numberInsightsGetErr);
                }

                // Get Number insights list
                var numberInsights = numberInsightsGetRes.body;

                // Set assertions
                (numberInsights[0].user._id).should.equal(userId);
                (numberInsights[0].name).should.match('Number insight name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Number insight if not logged in', function (done) {
    agent.post('/api/numberInsights')
      .send(numberInsight)
      .expect(403)
      .end(function (numberInsightSaveErr, numberInsightSaveRes) {
        // Call the assertion callback
        done(numberInsightSaveErr);
      });
  });

  it('should not be able to save an Number insight if no name is provided', function (done) {
    // Invalidate name field
    numberInsight.name = '';

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

        // Save a new Number insight
        agent.post('/api/numberInsights')
          .send(numberInsight)
          .expect(400)
          .end(function (numberInsightSaveErr, numberInsightSaveRes) {
            // Set message assertion
            (numberInsightSaveRes.body.message).should.match('Please fill Number insight name');

            // Handle Number insight save error
            done(numberInsightSaveErr);
          });
      });
  });

  it('should be able to update an Number insight if signed in', function (done) {
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

        // Save a new Number insight
        agent.post('/api/numberInsights')
          .send(numberInsight)
          .expect(200)
          .end(function (numberInsightSaveErr, numberInsightSaveRes) {
            // Handle Number insight save error
            if (numberInsightSaveErr) {
              return done(numberInsightSaveErr);
            }

            // Update Number insight name
            numberInsight.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Number insight
            agent.put('/api/numberInsights/' + numberInsightSaveRes.body._id)
              .send(numberInsight)
              .expect(200)
              .end(function (numberInsightUpdateErr, numberInsightUpdateRes) {
                // Handle Number insight update error
                if (numberInsightUpdateErr) {
                  return done(numberInsightUpdateErr);
                }

                // Set assertions
                (numberInsightUpdateRes.body._id).should.equal(numberInsightSaveRes.body._id);
                (numberInsightUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Number insights if not signed in', function (done) {
    // Create new Number insight model instance
    var numberInsightObj = new NumberInsight(numberInsight);

    // Save the numberInsight
    numberInsightObj.save(function () {
      // Request Number insights
      request(app).get('/api/numberInsights')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Number insight if not signed in', function (done) {
    // Create new Number insight model instance
    var numberInsightObj = new NumberInsight(numberInsight);

    // Save the Number insight
    numberInsightObj.save(function () {
      request(app).get('/api/numberInsights/' + numberInsightObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', numberInsight.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Number insight with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/numberInsights/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Number insight is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Number insight which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Number insight
    request(app).get('/api/numberInsights/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Number insight with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Number insight if signed in', function (done) {
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

        // Save a new Number insight
        agent.post('/api/numberInsights')
          .send(numberInsight)
          .expect(200)
          .end(function (numberInsightSaveErr, numberInsightSaveRes) {
            // Handle Number insight save error
            if (numberInsightSaveErr) {
              return done(numberInsightSaveErr);
            }

            // Delete an existing Number insight
            agent.delete('/api/numberInsights/' + numberInsightSaveRes.body._id)
              .send(numberInsight)
              .expect(200)
              .end(function (numberInsightDeleteErr, numberInsightDeleteRes) {
                // Handle numberInsight error error
                if (numberInsightDeleteErr) {
                  return done(numberInsightDeleteErr);
                }

                // Set assertions
                (numberInsightDeleteRes.body._id).should.equal(numberInsightSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Number insight if not signed in', function (done) {
    // Set Number insight user
    numberInsight.user = user;

    // Create new Number insight model instance
    var numberInsightObj = new NumberInsight(numberInsight);

    // Save the Number insight
    numberInsightObj.save(function () {
      // Try deleting Number insight
      request(app).delete('/api/numberInsights/' + numberInsightObj._id)
        .expect(403)
        .end(function (numberInsightDeleteErr, numberInsightDeleteRes) {
          // Set message assertion
          (numberInsightDeleteRes.body.message).should.match('User is not authorized');

          // Handle Number insight error error
          done(numberInsightDeleteErr);
        });

    });
  });

  it('should be able to get a single Number insight that has an orphaned user reference', function (done) {
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

          // Save a new Number insight
          agent.post('/api/numberInsights')
            .send(numberInsight)
            .expect(200)
            .end(function (numberInsightSaveErr, numberInsightSaveRes) {
              // Handle Number insight save error
              if (numberInsightSaveErr) {
                return done(numberInsightSaveErr);
              }

              // Set assertions on new Number insight
              (numberInsightSaveRes.body.name).should.equal(numberInsight.name);
              should.exist(numberInsightSaveRes.body.user);
              should.equal(numberInsightSaveRes.body.user._id, orphanId);

              // force the Number insight to have an orphaned user reference
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

                    // Get the Number insight
                    agent.get('/api/numberInsights/' + numberInsightSaveRes.body._id)
                      .expect(200)
                      .end(function (numberInsightInfoErr, numberInsightInfoRes) {
                        // Handle Number insight error
                        if (numberInsightInfoErr) {
                          return done(numberInsightInfoErr);
                        }

                        // Set assertions
                        (numberInsightInfoRes.body._id).should.equal(numberInsightSaveRes.body._id);
                        (numberInsightInfoRes.body.name).should.equal(numberInsight.name);
                        should.equal(numberInsightInfoRes.body.user, undefined);

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
      NumberInsight.remove().exec(done);
    });
  });
});
