import * as fs from 'fs';
import * as path from '../constants/path';
import { User } from '../constants/user';

export const getUsers = (): User[] => {
  return JSON.parse(fs.readFileSync(path.USERS, 'utf8'));
};

export const writeUsers = (newUsers: User[]) => {
  fs.writeFileSync(path.USERS, JSON.stringify(newUsers, undefined, 2), 'utf8');
};
