import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from '../constants/path';
import { User, UserDict } from '../constants/user';
import { checkProblemsetEnded, getProblemset } from './problemset';

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

export const getUserDict = (): UserDict => {
  const dict: UserDict = {};
  getUsers().forEach(user => {
    if (user.username === undefined) {
      return; // skip users not signed up yet
    }
    dict[user.username] = user;
  });
  return dict;
};

/*** Router middleware utils ***/

export const isValidUsername = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  if (!checkUsername(username)) {
    return res.status(404).json({ msg: 'invalid username' });
  }
  next();
};

export const isAuthorizedUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username;
  const problemsetId = req.params.problemsetId;
  if (problemsetId) {
    const problemset = getProblemset(problemsetId);
    if (checkProblemsetEnded(problemset)) {
      return next();
    }
  }
  if (username !== req.user.username) {
    return res.status(401).json({ msg: 'access denied' });
  }
  next();
};
