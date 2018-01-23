/**
 * Reads a list of emails and creates users.json for signup.
 *
 * Usage:
 *   node gen-users.js --emails {emails.json}
 */
import * as yargs from 'yargs';
import * as fs from 'fs';
const sha1 = require('crypto-js/sha1');

const emailFile = yargs.argv.emails;
if (!emailFile) {
  console.error('--emails arg is missing');
  process.exit(1);
}

const emails = JSON.parse(fs.readFileSync(emailFile, 'utf8'));

const users = emails.map((email: string) => {
  const code = sha1('' + Math.random()).toString().substr(0, 32);
  return {
    invitationCode: code,
    email: email,
    password: ''
  };
});

const outputFile = yargs.argv.output || 'users.json';
fs.writeFileSync(outputFile, JSON.stringify(users, undefined, 2), 'utf8');
