import { Response, Request, NextFunction, Express } from 'express';
import * as passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { User, UserSettings, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../constants/user';
import { users, updateUsers } from '../util/users';
import { MappedError } from 'express-validator/shared-typings';
import { isAuthenticated } from '../config/passport';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

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

  app.post('/api/check-login', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    res.json(req.user);
  });

  app.post('/api/logout', (req: Request, res: Response, next: NextFunction) => {
    req.logout();
    res.json(true);
  });

  app.post('/api/signup', (req: Request, res: Response, next: NextFunction) => {
    req.check('email', 'email must be valid').isEmail();
    req.check('username', 'username must be valid').matches(/^[a-z][a-z0-9_]*/).isLength({ min: MIN_USERNAME_LENGTH });
    req.check('password', 'password must contain at least 6 characters').isLength({ min: MIN_PASSWORD_LENGTH });
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

        const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
        users[i] = {
          username: req.body.username,
          email: req.body.email,
          invitationCode: req.body.invitationCode,
          password: hash,
          fullName: req.body.fullName,
          nickname: req.body.fullName,
          anonymous: false
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

  app.get('/api/settings', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    const settings: UserSettings = {
      nickname: req.user.nickname,
      anonymous: req.user.anonymous
    };
    res.json(settings);
  });

  app.post('/api/update-settings', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    req.check('nickname', 'nickname must not be empty').notEmpty();
    req.check('anonymous', 'anonymous must be boolean').isBoolean();
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

    let foundUser: User;
    for (let i = 0; i < users.length && !foundUser; i++) {
      if (users[i].email === req.user.email) {
        users[i].nickname = req.body.nickname;
        users[i].anonymous = req.body.anonymous;
        foundUser = users[i];
      }
    }
    if (!foundUser) {
      return res.status(500).json({ msg: 'critical server error' });
    }
    updateUsers(users);
    const settings: UserSettings = {
      nickname: foundUser.nickname,
      anonymous: foundUser.anonymous
    };
    res.json(settings);
  });

  app.post('/api/update-password', isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
    req.check('password', 'password must contain at least 6 characters').isLength({ min: MIN_PASSWORD_LENGTH });
    req.check('confirmPassword', 'passwords must match').equals(req.body.password);
    const errors = req.validationErrors() as MappedError[];
    if (errors) {
      return res.status(500).json({ msg: errors[0].msg });
    }

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
    updateUsers(users);
    res.json(true);
  });

};
