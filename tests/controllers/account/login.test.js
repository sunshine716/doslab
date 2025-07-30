// tests/routes/account.test.js
const request = require('supertest');        // ✅ Make sure this line is present
const app = require('../../../app');         // Your Express app
const cheerio = require('cheerio');          // For HTML parsing

describe('Test Account Functions', () => {
  test('Should show error message for invalid credentials', async () => {
    const res = await request(app)
      .post('/account/login')
      .send({
        username: 'wrong@example.com',
        password: 'wrongpassword'
      })
      .set('Accept', 'text/html');
    const cookies = res.headers['set-cookie'];
    
    // HTML response
    const $ = cheerio.load(res.text);
    const message = $('#login-error-alert').text();  
    expect(message.indexOf('Invalid username or passwsord!') != -1);
  });

  test('After login successfuly, a coonect.sid should be sent via header', async () => {
    const res = await request(app)
      .post('/account/login')
      .send({
        username: 'alice',
        password: '123456'
      })
      .set('Accept', 'text/html');

    // Check for Set-Cookie header
    const cookies = res.headers['set-cookie'];
    expect(Array.isArray(cookies) && cookies.length > 0).toBe(true);
    expect(cookies[0]).toMatch(/connect.sid/); 
  });
});
