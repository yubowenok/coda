import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../constants/user';
import { getUserList } from '../util/users';

passport.serializeUser((user: User, done) => {
  done(undefined, user.email);
});

passport.deserializeUser((email: string, done) => {
  const users = getUserList();
  for (let i = 0; i < users.length; i++) {
    if (email === users[i].email) {
      done(undefined, users[i]);
    }
  }
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy((username: string, password: string, done) => {
  const isEmail = username.match(/@/);
  const users = getUserList();
  for (let i = 0; i < users.length; i++) {
    const target = isEmail ? users[i].email : users[i].username;
    if (target === username) {
      if (bcrypt.compareSync(password, users[i].password)) {
        done(undefined, users[i]);
        return;
      }
    }
  }
  done(undefined, undefined, { message: 'invalid username or password' });
}));
