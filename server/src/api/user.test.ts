import * as request from 'supertest';
import * as childProcess from 'child_process';
import '../config/env';

beforeAll(() => {
  childProcess.execSync(`cp -R ${process.env.TEST_ROOT} ${process.env.CODA_ROOT}`);
});

describe('POST /api/signup', () => {
  let app;
  beforeAll(() => app = require('../app'));

  it('should be able to signup', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'by123',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'ABC',
        fullName: 'by'
      })
      .expect(200)
      .expect(res => expect(res.body).toMatchObject({
        email: 'by123@nyu.edu',
        username: 'by123',
        fullName: 'by',
        nickname: 'by',
        anonymizedName: ''
      }))
      .end(done);
  });

  it('should not signup without invitationCode', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'by123',
        password: '123456',
        confirmPassword: '123456',
        fullName: 'by'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/invitation code/))
      .end(done);
  });

  it('should not signup with mismatching passwords', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'by123',
        password: '123456',
        confirmPassword: '654321',
        invitationCode: 'ABC',
        fullName: 'by'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/match/))
      .end(done);
  });

  it('should not signup with too short username', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'ab',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'ABC',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/username/))
      .end(done);
  });

  it('should not signup with invalid username', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: '123',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'ABC',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/username/))
      .end(done);
  });

  it('should not signup without full name', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'by123',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'ABC',
        fullName: ''
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/full name/))
      .end(done);
  });

  it('should not duplicate signup', (done) => {
    request(app).post('/api/signup')
      .send({
        email: 'by123@nyu.edu',
        username: 'by123',
        password: '123456',
        confirmPassword: '123456',
        invitationCode: 'ABC',
        fullName: 'by'
      })
      .expect(500)
      .expect(res => expect(res.body.msg).toMatch(/duplicate/))
      .end(done);
  });
});

