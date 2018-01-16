import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../constants/user';
import { getUsers } from '../util/users';
const bcrypt = require('bcrypt');

import { Request, Response, NextFunction } from 'express';

passport.serializeUser((user: User, done) => {
  done(undefined, user.email);
});

passport.deserializeUser((email: string, done) => {
  const users = getUsers();
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
  const users = getUsers();
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

export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    console.log('pass auth');
    return next();
  }
  res.status(401).json({ msg: 'this page requires login' });
};
