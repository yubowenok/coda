import * as request from 'supertest';
import * as childProcess from 'child_process';
import './config/env';

beforeAll(() => {
  childProcess.execSync(`cp -R ${process.env.TEST_ROOT} ${process.env.CODA_ROOT}`);
});
afterAll(() => {
  // Do not remove test root as tests are async. Remove them later in wrapper script.
  // childProcess.execSync(`rm -rf ${process.env.CODA_ROOT}`);
});

describe('GET /', () => {

  let app;
  beforeAll(() => app = require('./app'));

  it('should return the HTML content', (done) => {
    request(app).get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200)
      .expect((res) => {
        if (!res.text.match(/^<!doctype html>(.|[\r\n])*<title>coda<\/title>/i)) {
          throw new Error('no HTML title found');
        }
      })
      .end(done);
  });
});
