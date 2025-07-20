

const db = require('../../libs/dbClient')('DB');

test('test db cquery', (done) => {

  db.getCount('SELECT * FROM users', [], (err, count) => {
    if (err) { return done(err); }
    expect(typeof count).toBe('number');

    done(); // tell Jest test is done
  });
});

afterAll(() => {
  const dbClient = require('../../libs/dbClient');
  dbClient.close(); // closes the pool after all tests
});
