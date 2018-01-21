import '../config/env';
import * as fs from 'fs';
import * as paths from '../constants/path';
import * as path from 'path';
import * as child_process from 'child_process';
import * as yargs from 'yargs';
import {
  ProblemConfig,
  ProblemsetConfig,
  problemsetConfigPath,
  ProblemsetProblem,
  Submission,
  Verdict
} from '../constants';
import {
  getProblem,
  getProblemset,
  getSubmissionList,
  getVerdictsList
} from '../util';

const containerName = process.env.CONTAINER_NAME || 'coda-judge-container';
const dockerRoot = process.env.DOCKER_ROOT || '/usr/share/src';
const imageName = process.env.IMAGE_NAME || 'szfck/nyu-problemtools:latest';

const localRoot = process.env.CODA_ROOT;
const problemSetRoot = paths.problemsetDir();

function systemSync(cmd: string) {
  try {
    return child_process.execSync(cmd).toString();
  } catch (err) {
    console.error('systemSync failed', err);
  }
}

function judgeSubmission(problemId: string, subtask: string, source: string) {
  const problemConf: ProblemConfig = getProblem(problemId);

  if (problemConf.timeLimit === undefined) {
    console.log(`WARNNING: prolem ${problemId} no set time limit`);
    return;
  }
  console.log(`judge sourceFile: ${source}, problem: ${problemId}, subtask: ${subtask}`);

  let cmdLine = `docker exec ${containerName} judge --source=${source} --problem=${paths.judgeProblemPath(problemId)}`;

  if (subtask === undefined || subtask === '') {
    console.error(`WARNNING: no subtask for problem ${problemId}`);
    return;
  } else {
    if (subtask !== 'all') {
      cmdLine += ` --subtask=${subtask}`;
    }
  }
  cmdLine += ` --time=${problemConf.timeLimit}`;
  console.log(`execute command line: ${cmdLine}`);

  return JSON.parse(systemSync(cmdLine));
}

function judgeProblemSet(problemsetId: string) {
  console.log(`judging problemset ${problemsetId} ...`);

  const problemset: ProblemsetConfig = getProblemset(problemsetId);
  const problems: ProblemsetProblem[] = problemset.problems;
  const submissions: Submission[] = getSubmissionList(problemsetId);
  const verdicts: Verdict[] = getVerdictsList(problemsetId);

  const map: { [name: string]: string } = {};

  for (let i = 0; i < problems.length; i++) {
    map[problems[i].number] = problems[i].id;
  }

  const set: { [sourceFile: string]: any } = new Set();

  for (let i = 0; i < verdicts.length; i++) {
    set.add(verdicts[i].sourceFile);
  }

  for (let i = 0; i < submissions.length; i++) {
    const sourceFile: string = submissions[i].sourceFile;
    if (set.has(sourceFile)) {
      continue;
    }

    if (map[submissions[i].problemNumber] === undefined) {
      console.log(`WARNNING: problem number: ${submissions[i].problemNumber} can not find problem path`);
      continue;
    }

    const subtask = submissions[i].subtask;
    const problemId = map[submissions[i].problemNumber];
    const username = submissions[i].username;

    const result = judgeSubmission(
      problemId,
      subtask,
      paths.judgeSubmissionSourcePath(problemsetId, submissions[i]),
    );

    let failedCase = 0;
    if (result.failedCase !== undefined) {
      failedCase = result.totalCases + 1 - result.failedCase.number;
    }

    const verdict: Verdict = {
      username: username,
      submissionNumber: Number(submissions[i].problemNumber),
      sourceFile: sourceFile,
      verdict: result.verdict,
      executionTime: Number(result.time),
      failedCase: failedCase,
      totalCase: result.totalCases
    };

    console.log(verdict);
    verdicts.push(verdict);
  }
  fs.writeFileSync(paths.problemsetVerdictsPath(problemsetId), JSON.stringify(verdicts, undefined, 2));
  console.log(`end judge problemset ${problemsetId}`);
}

function judgeAll(runningProblemsetConfigId: string) {
  let files: string[] = [];

  if (runningProblemsetConfigId === undefined) {
    files = fs.readdirSync(problemSetRoot);
    console.log('start judging all the problemset ******** ');
  } else {
    console.log(`start judgeing problemsets from ${runningProblemsetConfigId}`);
    files = JSON.parse(fs.readFileSync(paths.runningProblemsetConfigPath(runningProblemsetConfigId), 'utf8'));
  }

  files.forEach(function (file) {
    judgeProblemSet(file);
  });
}

const dockerStr = systemSync(`docker ps -a`);

if (dockerStr.indexOf(containerName) > -1) {
  systemSync(`docker stop ${containerName}`);
  systemSync(`docker rm ${containerName}`);
}

systemSync(`docker run -dit --name ${containerName} -v ${path.resolve(localRoot)}:${dockerRoot} ${imageName}`);

const interval = yargs.argv.interval;
const runningProblemset = yargs.argv.problemset;

if (interval === undefined) {
  // run judge once
  judgeAll(runningProblemset);
} else {
  // run judge every interval seconds
  setInterval(function() {
    judgeAll(runningProblemset);
  }, interval * 1000);
}
