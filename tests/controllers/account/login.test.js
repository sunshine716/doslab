// tests/routes/user.test.js
const request = require('supertest');
const app = require('../../../app'); // your Express app

test('GET /', async () => {
  const res = await request(app).get('/');

  expect(res.statusCode).toBe(200);
  
});
