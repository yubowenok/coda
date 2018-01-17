import * as fs from 'fs';
import * as path from '../constants/path';
import { User } from '../constants/user';
import { Request, Response, NextFunction } from 'express';

export const getUsers = (): User[] => {
  return JSON.parse(fs.readFileSync(path.usersPath(), 'utf8'));
};

export const checkUsername = (username: string): boolean => {
  const users = getUsers();
  return users.map((user: User) => {
    return user.username;
  }).indexOf(username) !== -1;
};

export const writeUsers = (newUsers: User[]) => {
  fs.writeFileSync(path.usersPath(), JSON.stringify(newUsers, undefined, 2), 'utf8');
};

/*** Router utils ***/

export const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  if (!checkUsername(username)) {
    return res.status(404).json({ msg: 'invalid username' });
  }
  next();
};

export const isAuthorizedUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  if (!req.user || username !== req.user.username) {
    return res.status(401).json({ msg: 'access denied' });
  }
  next();
};
