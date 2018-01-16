import { Response, Request, NextFunction, Express } from 'express';
import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { User } from '../constants/user';
import { users, updateUsers } from '../util/users';
import { MappedError } from 'express-validator/shared-typings';
import * as passportConfig from '../config/passport';

const bcrypt = require('bcrypt');

module.exports = function(app: Express) {
  app.post('/api/login', (req: Request, res: Response, next: NextFunction) => {
    if (req.body.username.match(/@/)) {
      req.check('username', 'email must be valid').isEmail();
      req.sanitize('username').normalizeEmail();
    } else {
      req.check('username', 'username must not be empty').notEmpty();
    }
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    passport.authenticate('local', (err: Error, user: User | undefined, info: IVerifyOptions) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(500).json({ msg: info.message });
      }
      req.login(user, (loginErr: Error) => {
        if (loginErr) {
          return next(loginErr);
        }
        res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/check-login', passportConfig.isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    res.json(req.user);
  });

  app.post('/api/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    res.json(true);
  });

  app.post('/api/signup', (req: Request, res: Response, next: NextFunction) => {
    req.check('email', 'email must be valid').isEmail();
    req.check('username', 'username must be valid').matches(/^[a-z][a-z0-9_]*/).isLength({ min: 3 });
    req.check('password', 'password must contain at least 6 characters').isLength({ min: 6 });
    req.check('confirmPassword', 'passwords must match').equals(req.body.password);
    req.check('fullName', 'full name must not be empty').notEmpty();
    req.sanitize('email').normalizeEmail();

    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    let foundUser: User;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === req.body.email) {
        if (req.body.invitationCode !== users[i].invitationCode) {
          return res.status(500).json({ msg: 'invitation code must match email' });
        }

        if (users[i].password !== '') {
          return res.status(500).json({ msg: 'duplicate signup' });
        }

        const saltRounds = 12;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);
        users[i] = {
          username: req.body.username,
          email: req.body.email,
          invitationCode: req.body.invitationCode,
          password: hash,
          fullName: req.body.fullName,
          nickname: req.body.fullName,
          anonymizedName: ''
        };

        foundUser = users[i];
      }
    }

    if (!foundUser) {
      return res.status(500).json({ msg: 'invitation code must match email' });
    }
    updateUsers(users);
    req.login(foundUser, (err) => {
      if (err) {
        return next(err);
      }
      res.json(foundUser);
    });
  });
};
