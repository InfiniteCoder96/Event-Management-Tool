const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', function(done) {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏' 
      }, done);
  });
});

describe('POST /api/v1/messages', () => {
  it('Inserts a new message', function(done) {

    const requestObj = {
      name: 'CODER',
      message: 'This app is cool',
      latitude: -90,
      longitude: 180
    };

    const responseObj = {
      ...requestObj,
      _id: '5d557cdcd28ee35198223353',
      date: '2019-08-15T15:40:11.797Z'
    };

    request(app)
      .post('/api/v1/messages')
      .send(requestObj)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body._id = '5d557cdcd28ee35198223353',
        res.body.date = '2019-08-15T15:40:11.797Z'
      })
      .expect(200, responseObj, done);
  });
});
