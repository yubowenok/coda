# Coda

[![Build Status](https://travis-ci.com/yubowenok/coda.svg?token=72Mbb98eevCq6x2s2zUd&branch=dockerJudge)](https://travis-ci.com/yubowenok/coda)

Coda Online Judge Platform

Light-weight contest & practice platform for Coding Of Data structure and Algorithm.

![image](https://user-images.githubusercontent.com/1314429/35206822-4d568f18-ff0d-11e7-956c-c7bea2706c20.png)
![image](https://user-images.githubusercontent.com/1314429/35206851-78459c28-ff0d-11e7-8c9d-3355124aa5fd.png)


### Install

Suggested nodejs version 8.9.4, npm version 5.6.

Coda has three components: web, server, and judge. Install the parts separately.

```bash
npm install # web
npm --prefix ./server install # server & judge

npm --prefix run init-judge # initialize judge
```

Judge initialization requires permission to talk to Docker daemon.
You may need to add the current user to the "docker" group.
The init-judge script pulls the docker judge image, which may take a while to download.


### Run in development

```bash
# web
npm start
# server & judge
npm --prefix ./server run build
npm --prefix ./server start
npm --prefix ./server run judge -- --interval 5 # Judge every 5 seconds
```

Coda shall then be served at http://localhost:4200.

### Run in production

Copy the files at /dist/ and /server/dist/ to your server deployment.
Maintain the relative directory structure between web and server.

Configure CODA_ROOT path, server PORT and ALLOW_ORIGIN in /server/.env. 
See /server/.env.example for an example configuration.

CODA_ROOT must be a valid Coda storage directory.
See /server/test_root for a small storage directory example.
This directory must be readable and writable for the user that runs the Coda server.

Coda web is served at the given PORT (default 3000).
If you need access to HTTP port 80, you need to do port forwarding.
If you use [Nginx](http://nginx.org/), you can configure proxy as:
```
server {
  listen 80;
  server_name {YourServerName};

  location / {
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_cache_bypass $http_upgrade;

    proxy_pass http://127.0.0.1:3000;
    proxy_redirect off;
  }
}
```
 
Build in production mode:

```bash
# web: build it before running the server
npm run build
# server & judge
npm --prefix ./server run serve
npm --prefix ./server run judge -- --interval 5 # Judge every 5 seconds
```

You can use [pm2](http://pm2.keymetrics.io/) to manage your process in production.
```bash
# at /server directory
pm2 start dist/server.js
pm2 start dist/judge/judge.js -- --interval 5
```
Then use ``pm2 startup`` to manage your startup script in case the machine reboots.

### System config

You can add a file "config.json" at CODA_ROOT to specify system options.

```json
{
  "disableSource": true,
  "judgeProblemsets": ["problemset1", "problemset2"]
}
```

**disableSource**: When true, all users can view their own submissions in all problemsets, including those that have ended.

**judgeProblemsets**: Only those problemsets in the list are judged. Give null if every problemset is to be judged.


### User signup

You can prepare a json file that contains a list of emails, e.g.

```json
[
  "user1@some.domain",
  "user2@some.domain"
]
```

Then use the gen-users script to create a users.json. 
Place the users.json under the CODA_ROOT.
Set EMAIL_* environment variables (see .env.example).
Finally use the email-signup script to send each user an email with an invitation code for signup.

```bash
# at /server
npm run gen-users -- --emails emails.json
cp users.json $CODA_ROOT/users.json
npm run email-signup
```

### Export source code

You can export all submission source to a folder.

```bash
npm run export-code -- --problemset {problemsetId}
```
