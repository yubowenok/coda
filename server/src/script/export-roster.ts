/**
 * Creates a mapping from username to email.
 *
 * Usage:
 *   node export-roster.js --group {userGroup} [--output {outputFile}]
 */
import '../config/env';
import * as yargs from 'yargs';
import * as fs from 'fs';
import { getUserList } from '../util/users';

const group = yargs.argv.group;
if (!group) {
  console.error('require arg --group');
  process.exit(1);
}

const output = yargs.argv.output || 'roster.json';

if (fs.existsSync(output)) {
  console.error(`output file "${output}" exists`);
  process.exit(1);
}

const users = getUserList();
const outputJson: { [username: string]: { email: string, nickname: string } } = {};

users.forEach(user => {
  const groups = user.groups || [];
  if (groups.indexOf(group) !== -1) {
    outputJson[user.username] = {
      email: user.email,
      nickname: user.nickname
    };
  }
});

fs.writeFileSync(output, JSON.stringify(outputJson, undefined, 2), 'utf8');
