import { Express } from 'express';
import * as request from 'supertest';
import * as childProcess from 'child_process';
import '../config/env';

beforeAll(() => {
  childProcess.execSync(`cp -R ${process.env.TEST_ROOT} ${process.env.CODA_ROOT}`);
});

describe('user signup', () => {
  let app: Express;
  beforeAll(() => app = require('../app'));

  it('should not signup without invitationCode', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'bytest',
        password: '123456',
        confirmPassword: '123456',
        fullName: 'byu'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/invitation code/))
      .end(done);
  });

  it('should not signup with mismatching passwords', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'bytest',
        password: '123456',
        confirmPassword: '654321',
        invitationCode: '',
        fullName: 'byu'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/match/))
      .end(done);
  });

  it('should not signup with too short username', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'ab',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'XYZ',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/username/))
      .end(done);
  });

  it('should not signup with invalid username', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: '123',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'XYZ',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/username/))
      .end(done);
  });

  it('should not signup without full name', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'bytest',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'XYZ',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/full name/))
      .end(done);
  });

  it('should be able to signup', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'bytest',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'XYZ',
        fullName: 'byu'
      })
      .expect(200)
      .expect(res => expect(res.body).toMatchObject({
        email: 'bytest@nyu.edu',
        username: 'bytest',
        fullName: 'byu',
        nickname: 'byu'
      }))
      .end(done);
  });

  it('should not duplicate signup', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'bytest@nyu.edu',
        username: 'bytest2',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'XYZ',
        fullName: 'byu'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/email has already signed up/))
      .end(done);
  });

  it('should not allow duplicate username', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'jz000@nyu.edu',
        username: 'bytest',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'CCC',
        fullName: 'jz000'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/username exists/))
      .end(done);
  });

  it('should be able to login', (done) => {
    request(app).post('/api/login')
      .send({
        username: 'bytest',
        password: '123456'
      })
      .expect(200, done);
  });

});

describe('update password/settings', () => {

  let app: Express;
  let agent: supertest.SuperTest<supertest.Test>;
  let cookie: string;

  beforeAll((done) => {
    app = require('../app');
    agent = request(app);
    agent.post('/api/login')
      .send({
        username: 'by123',
        password: '123456'
      })
      .then((res) => {
        // Hack regarding: https://github.com/facebook/jest/issues/3547
        const cookies = res.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
        cookie = cookies.join(';');
        done();
      });
  });

  it('should update password', (done) => {
    agent.post('/api/update-password')
      .set('cookie', cookie)
      .send({
        currentPassword: '123456',
        password: '1234567',
        confirmPassword: '1234567'
      })
      .expect(200, done);
  });

  it('should update settings', (done) => {
    agent.post('/api/update-settings')
      .set('cookie', cookie)
      .send({
        nickname: 'BY123',
        fullName: 'BYU'
      })
      .expect(200)
      .expect(res => expect(res.body).toEqual({
        nickname: 'BY123',
        fullName: 'BYU'
      }))
      .end(done);
  });

  it('should not allow nickname with excessive length', (done) => {
    agent.post('/api/update-settings')
      .set('cookie', cookie)
      .send({
        nickname: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij',
        fullName: 'BYU'
      })
      .expect(500)
      .end(done);
  });

  it('should not allow full name with excessive length', (done) => {
    agent.post('/api/update-settings')
      .set('cookie', cookie)
      .send({
        nickname: 'BYU',
        fullName: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij'
      })
      .expect(500)
      .end(done);
  });

  it('should logout', (done) => {
    agent.post('/api/logout')
      .set('cookie', cookie)
      .expect(200)
      .expect(res => expect(res.body).toBe(true))
      .end(done);
  });

  it('should not login with old password', (done) => {
    agent.post('/api/login')
      .send({
        username: 'by123',
        password: '123456'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/invalid username or password/))
      .end(done);
  });

});
