import './config/env';
import * as fs from 'fs';
import * as paths from './constants/path';
import * as path from 'path';
import * as child_process from 'child_process';

const containerName = 'coda-test';
const dockerRoot = '/usr/share/src';
const localRoot = process.env.CODA_ROOT;
const problemSetRoot = paths.problemsetDir();

function systemSync(cmd: string) {
  try {
    return child_process.execSync(cmd).toString();
  }
  catch (error) {
    // error.status;  // Might be 127 in your example.
    // error.message; // Holds the message you typically want.
    // error.stderr;  // Holds the stderr output. Use `.toString()`.
    // error.stdout;  // Holds the stdout output. Use `.toString()`.
  }
}

function readJsonFile(file: string) {
    const rawdata = fs.readFileSync(file);
    return JSON.parse(rawdata.toString());
}

function judgeSubmission(problem: string, subtask: string, source: string, timeLimit: number) {
    if (!timeLimit) {
        timeLimit = 1;
    }

    let cmd_line =
    'docker exec ' + containerName + ' judge' +
    ' --source=' +  source +
    ' --problem=' + problem;

    if (subtask !== '') {
        cmd_line += ' --subtask=' + subtask;
    }
    cmd_line += ' --time=' + timeLimit;
    console.log(cmd_line);

    return JSON.parse(systemSync(cmd_line));
}

function judgeProblemSet(problemSetName: string) {
    const problemSetPath = paths.problemsetDir(problemSetName);
    const configPath = paths.problemsetConfigPath(problemSetName);
    const submissionsPath = paths.problemsetSubmissionsPath(problemSetName);
    const verdictPath = paths.problemsetVerdictsPath(problemSetName);

    const config = readJsonFile(configPath);
    const submissions = readJsonFile(submissionsPath);
    const verdicts = readJsonFile(verdictPath);

    const problems = config['problems'];
    const map: {[name: string]: string} = {};

    for (let i = 0; i < problems.length; i++) {
        map[problems[i]['number']] = problems[i]['id'];
    }

    const set = new Set();

    for (let i = 0; i < verdicts.length; i++) {
        set.add(verdicts[i]['sourceFile']);
    }

    for (let i = 0; i < submissions.length; i++) {
        const sourceFile: string = submissions[i]['sourceFile'];
        if (set.has(sourceFile)) {
            continue;
        }

        const subtask = submissions[i]['subtask'];
        const problemName = map[submissions[i]['problemNumber']];
        const userName = submissions[i]['username'];
        const problemPath = paths.problemDir(problemName);
        const sourcePath = path.join(problemSetPath, 'source', userName, sourceFile);
        const timeLimit = readJsonFile(paths.problemConfigPath(problemName))['timeLimit'];

        if (subtask === 'all') {
            continue;
        }

        const result = judgeSubmission(path.join(dockerRoot, 'problem', problemName),
         subtask, path.join(dockerRoot, 'problemset',
         problemSetName, 'source', userName, sourceFile), timeLimit);

        let failedCase = 0;
        if (result['failedCase']) {
            failedCase = result['totalCases'] + 1 - result['failedCase']['number'];
        }

        const pos1 = sourceFile.indexOf('_') + 1;
        const pos2 = sourceFile.indexOf('_', pos1 );
        const submissionNumber = sourceFile.substr(pos1, pos2 - pos1);

        const verdict = {
            'username': userName,
            'submissionNumber': Number(submissionNumber),
            'sourceFile': sourceFile,
            'verdict': result['verdict'],
            'executionTime': Number(result['time']),
            'failedCase': failedCase,
            'totalCase': result['totalCases']
        };
        verdicts.push(verdict);
    }
    fs.writeFileSync(verdictPath, JSON.stringify(verdicts, undefined, 4));
}
function judgeAll() {
    const files = fs.readdirSync(problemSetRoot);
    files.forEach(function(file) {
        judgeProblemSet(file);
    });
}
// { verdict: 'WA',
//   failedCase: { number: 1, name: 'sample/sample-large' },
//   time: '0.00',
//   totalCases: 4 }

/*
{
    "username": "by123",
    "submissionNumber": 1,
    "sourceFile": "by123_1_A_small.cpp",
    "verdict": "AC",
    "executionTime": 0.05,
    "memory": 128,
    "failedCase": 0,
    "totalCase": 2
  }
  */

// docker run -dit --name coda-test
// -v /Users/kaichen/Dev/docker/codaTest:/usr/share/src szfck/nyu-problemtools:1.0.4
// pull docker image and create a container
const imageName = 'szfck/nyu-problemtools:1.0.4';
// console.log('docker pull ' + imageName);

systemSync('docker pull ' + imageName);

systemSync('docker stop ' + containerName);
systemSync('docker rm ' + containerName);

systemSync('docker run -dit --name ' + containerName +
' -v ' + path.resolve(localRoot) + ':' + dockerRoot + ' ' +
imageName);

// example to judge one problemSet
judgeProblemSet('warmup');

// uncomment code below to judgeall problemSet every 5 seconds
// setInterval(judgeAll, 5 * 1000);
