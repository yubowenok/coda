import '../config/env';
import * as nodemailer from 'nodemailer';
import { getUserList } from './users';
import { User } from '../constants/user';
import * as path from 'path';

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailSmtp = process.env.EMAIL_SMTP;
const emailSender = process.env.EMAIL_SENDER;

if (!emailUser || !emailPassword || !emailSmtp || !emailSender) {
  console.error('require env EMAIL_USER, EMAIL_PASSWORD, EMAIL_SMTP, EMAIL_SENDER');
  process.exit(1);
}

const codaDomain = process.env.CODA_DOMAIN;
if (!codaDomain) {
  console.error('require env CODA_DOMAIN');
  process.exit(1);
}

const users = getUserList();

users.forEach((user: User) => {
  if (user.password) {
    return; // ignore users who have signed up
  }
  const transporter = nodemailer.createTransport({
    host: emailSmtp,
    port: 587,
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

  const name = `Hello,`;
  const content = `Please signup for coda at ${'http://' + path.join(codaDomain, 'signup', user.invitationCode)}`;
  const note = `Do not reply to this email.`;
  const mailOptions = {
    from: emailSender,
    to: user.email,
    subject: 'coda signup link',
    text: [name, content, note].join('\n'),
    html:
      `<div>Hello,</div>
<p>${content}</p>
<p>${note}</p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return err;
    }
    console.log('message sent: %s', info.messageId);
  });
});
