/**
 * Reads a list of emails and creates users.json for signup.
 *
 * Usage:
 *   node gen-users.js --emails {emails.json} --groups {groups}
 *
 * emails.json: A json array containing user emails.
 * groups: Comma separated string of groups to be assigned.
 *
 */
import * as yargs from 'yargs';
import * as fs from 'fs';
const sha1 = require('crypto-js/sha1');

const emailFile = yargs.argv.emails;
if (!emailFile) {
  console.error('--emails arg is missing');
  process.exit(1);
}
const groups = yargs.argv.groups || '';

const emails = JSON.parse(fs.readFileSync(emailFile, 'utf8'));

const users = emails.map((email: string) => {
  const code = sha1('' + Math.random()).toString().substr(0, 32);
  return {
    invitationCode: code,
    email: email,
    password: '',
    groups: groups.split(','),
  };
});

const outputFile = yargs.argv.output || 'users.json';
fs.writeFileSync(outputFile, JSON.stringify(users, undefined, 2), 'utf8');
