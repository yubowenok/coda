import * as fs from 'fs';
import * as path from '../constants/path';
import { User } from '../constants/user';

export const users: User[] = JSON.parse(fs.readFileSync(path.USERS, 'utf8'));

export const updateUsers = (newUsers: User[]) => {
  fs.writeFileSync(path.USERS, JSON.stringify(newUsers, undefined, 2), 'utf8');
};
