import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as paths from '../constants/path';
import { User, UserDict, UserSession } from '../constants/user';
import { ScoreboardMode } from '../constants/problemset';
import { checkProblemsetEnded, getProblemset } from './problemset';
import * as _ from 'lodash';

const getUsers = (): User[] => {
  return JSON.parse(fs.readFileSync(paths.usersPath(), 'utf8'));
};

const getUserSessions = (problemsetId: string): UserSession[] => {
  const sessionFile = paths.problemsetSessionsPath(problemsetId);
  const json = (fs.existsSync(sessionFile) && fs.readFileSync(sessionFile, 'utf8')) || '';
  return json ? JSON.parse(json) : [];
};

export const getUserList = (): User[] => {
  return getUsers();
};

export const checkUsername = (username: string): boolean => {
  const users = getUsers();
  return users.map((user: User) => {
    return user.username;
  }).indexOf(username) !== -1;
};

export const writeUsers = (newUsers: User[]) => {
  fs.writeFileSync(paths.usersPath(), JSON.stringify(newUsers, undefined, 2), 'utf8');
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

export const getUserSession = (problemsetId: string, username: string): UserSession | undefined => {
  return getUserSessions(problemsetId).filter(session => session.username === username)[0];
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
  const userGroups = req.user && req.user.groups || [];
  if (userGroups.indexOf('admin') !== -1) {
    req.user.isAdmin = true;
  }

  if (problemsetId) {
    const problemset = getProblemset(problemsetId);

    const allowedUsers = problemset.allowUsers || [];
    if (allowedUsers.indexOf(req.user.username) !== -1 || allowedUsers.indexOf(req.user.email) !== -1) {
      return next();
    }

    const allowedGroups = (problemset.allowGroups || []).concat(['admin']);
    const commonGroups = _.intersection(allowedGroups, userGroups);
    if (commonGroups.length) {
      return next();
    }

    if (checkProblemsetEnded(problemset) && problemset.scoreboardMode === ScoreboardMode.ENABLED) {
      return next();
    }
  }
  if (username && username !== req.user.username) {
    return res.status(401).json({ msg: 'not available' });
  }
  next();
};
