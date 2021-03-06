import { Response, Request, NextFunction, Express } from 'express';
import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import {
  User,
  UserSettings,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH
} from '../constants/user';
import { MappedError } from 'express-validator/shared-typings';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { logger } from '../logger';

import { getUserList, writeUsers, isAuthenticated, isAuthorizedUser, isAdminUser } from '../util';

const SALT_ROUNDS = 12;

/**
 * Creates a web format user info object
 */
const toWebUser = (user: User): Object => {
  return {
    ..._.omit(user, ['password', 'invitationCode', 'groups']),
    isAdmin: isAdminUser(user)
  };
};

module.exports = function(app: Express) {

  app.post('/api/login', (req: Request, res: Response, next: NextFunction) => {
    if (req.body.username.match(/@/)) {
      req.check('username', 'email must be valid').isEmail();
      req.sanitize('username').normalizeEmail({ gmail_remove_dots: false });
    } else {
      req.check('username', 'username must not be empty').notEmpty()
        .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH });
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
        res.json(toWebUser(user));
      });
    })(req, res, next);
  });

  app.post('/api/check-login',
    isAuthorizedUser,
    (req: Request, res: Response) => {
    if (req.user) {
      return res.json(toWebUser(req.user));
    }
    res.json(false);
  });

  app.post('/api/login-switch', (req: Request, res: Response) => {
    logger.warn('account switch', `"${req.body.lastUsername}" -> "${req.body.username}"`);
    res.json(true);
  });

  app.post('/api/logout', (req: Request, res: Response) => {
    req.logout();
    res.json(true);
  });

  app.post('/api/signup', (req: Request, res: Response, next: NextFunction) => {
    req.check('email', 'email must be valid').isEmail();
    req.check('username', 'username must be valid')
      .matches(/^[a-z][a-z0-9_]*$/)
      .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH });
    req.check('password', 'invalid password length')
      .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH });
    req.check('confirmPassword', 'passwords must match').equals(req.body.password);
    req.check('fullName', 'full name must be valid')
      .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH });
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    const users = getUserList();
    if (users.map((user: User) => {
        return user.username;
      }).indexOf(req.body.username) !== -1) {
      return res.status(500).json({ msg: 'username exists' });
    }

    let foundUser: User;
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === req.body.email) {
        if (req.body.invitationCode !== users[i].invitationCode) {
          return res.status(500).json({ msg: 'invitation code must match email' });
        }

        if (users[i].password !== '') {
          return res.status(500).json({ msg: 'email has already signed up' });
        }

        const groups = users[i].groups; // preserve group settings

        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
        users[i] = {
          username: req.body.username,
          email: req.body.email,
          invitationCode: req.body.invitationCode,
          password: hash,
          fullName: req.body.fullName,
          nickname: req.body.fullName
        };

        if (groups) {
          users[i].groups = groups;
        }

        foundUser = users[i];
      }
    }

    if (!foundUser) {
      return res.status(500).json({ msg: 'invitation code must match email' });
    }
    writeUsers(users);
    req.login(foundUser, (err) => {
      if (err) {
        return next(err);
      }
      res.json(toWebUser(foundUser));
    });
  });

  app.get('/api/settings', isAuthenticated, (req: Request, res: Response) => {
    const settings: UserSettings = {
      fullName: req.user.fullName,
      nickname: req.user.nickname
      // anonymous: req.user.anonymous
    };
    res.json(settings);
  });

  app.post('/api/update-settings', isAuthenticated, (req: Request, res: Response) => {
    req.check('fullName', 'fullName must not be empty').notEmpty()
      .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH });
    req.check('nickname', 'nickname must not be empty').notEmpty()
      .isLength({ min: MIN_NAME_LENGTH, max: MAX_NAME_LENGTH });

    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    const users = getUserList();
    let foundUser: User;
    for (let i = 0; i < users.length && !foundUser; i++) {
      if (users[i].email === req.user.email) {
        users[i].fullName = req.body.fullName;
        users[i].nickname = req.body.nickname;
        foundUser = users[i];
      }
    }
    if (!foundUser) {
      return res.status(500).json({ msg: 'critical server error' });
    }
    writeUsers(users);
    const settings: UserSettings = {
      fullName: foundUser.fullName,
      nickname: foundUser.nickname
    };
    res.json(settings);
  });

  app.post('/api/update-password', isAuthenticated, (req: Request, res: Response) => {
    req.check('password', 'password must contain at least 6 characters')
      .isLength({ min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH });
    req.check('confirmPassword', 'passwords must match').equals(req.body.password);
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    const users = getUserList();
    let found = false;
    for (let i = 0; i < users.length && !found; i++) {
      if (users[i].email === req.user.email) {
        users[i].password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
        found = true;
      }
    }
    if (!found) {
      return res.status(500).json({ msg: 'critical server error' });
    }
    writeUsers(users);
    res.json(true);
  });

};
