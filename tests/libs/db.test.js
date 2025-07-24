const db = require('../../libs/dbClient')('DB');

test('test getCount method', (done) => {

  db.getCount('SELECT * FROM users', [], (err, count) => {
    if (err) { return done(err); }
    expect(typeof count).toBe('number');

    done(); // tell Jest test is done
  });
});

test('test executeQuery method', (done) => {
  const name = 'alice'; 

  db.executeQuery('SELECT * FROM users WHERE username = $1', [name], (err, rows) => {
    if (err) { return done(err); }
    //Expect more than one row to be returned
    expect(rows.length).toBeGreaterThan(0);
  });

  done();
});

afterAll(() => {
  const dbClient = require('../../libs/dbClient');
  dbClient.close(); // closes the pool after all tests
});
