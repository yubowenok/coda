import '../config/env';
import * as fs from 'fs';
import * as paths from '../constants/path';
import * as path from 'path';
import * as child_process from 'child_process';
import * as yargs from 'yargs';
import {
  ProblemConfig,
  ProblemsetConfig,
  ProblemsetProblem,
  Submission,
  Verdict,
  DockerVerdict,
  VerdictType
} from '../constants';
import {
  getProblem,
  getProblemset,
  getSubmissionList,
  getProblemsetList,
  getVerdictsList
} from '../util';

const containerName = process.env.CONTAINER_NAME;
const dockerRoot = process.env.DOCKER_ROOT;
const imageName = process.env.IMAGE_NAME;
const judgeFileName = 'Solution';

const localRoot = process.env.CODA_ROOT;

function systemSync(cmd: string) {
  try {
    return child_process.execSync(cmd).toString();
  } catch (err) {
    console.error('systemSync failed', err);
  }
}

function judgeSubmission(problemId: string, subtask: string, source: string): DockerVerdict {
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

function changeJavaClass(contents: string, name: string) {
  contents = '' + contents.replace(/ +(?= )/g, '');
  let pos = contents.indexOf('public class ');

  if (pos > -1) {
    pos += 'public class '.length;
    const nxt = contents.indexOf('{', pos);
    if (nxt > -1) {
      contents = contents.substr(0, pos) + name + contents.substr(nxt);
    }
  }

  return contents;
}

function judgeProblemSet(problemsetId: string) {
  // console.log(`judging problemsetId ${problemsetId}`);

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
    const sourcePath = paths.submissionSourcePath(problemsetId, submissions[i]);

    // copy source code to accepted folder to judge
    let content = fs.readFileSync(sourcePath).toString();
    if (path.extname(sourceFile) === '.java') {
      // change java class name
      content = changeJavaClass(content, judgeFileName);
    }
    const subproblemPath = paths.problemDir(problemId);
    const tmpFileName = judgeFileName + path.extname(sourceFile);
    const dockerSource = paths.dockerJudgeSourcePath(problemId, subtask, tmpFileName);
    const copyFilePath = paths.localJudgeSourcePath(problemId, subtask, tmpFileName);

    fs.writeFileSync(copyFilePath, content);

    const result: DockerVerdict = judgeSubmission(
      problemId,
      subtask,
      dockerSource
    );

    if (result.time === undefined) {
      result.time = 0;
    }

    const verdict: Verdict = {
      username: username,
      submissionNumber: submissions[i].submissionNumber,
      sourceFile: sourceFile,
      verdict: result.verdict,
      executionTime: result.time,
      failedCase: result.failedCase.number,
      totalCase: result.totalCases
    };

    if (result.verdict === VerdictType.CE) {
      let ceMsg = result.compilationError;
      while (true) {
        const pos = ceMsg.indexOf(dockerSource);
        if (pos > -1) {
          ceMsg = ceMsg.substr(0, pos) + sourceFile + ceMsg.substr(pos + dockerSource.length);
        } else {
          break;
        }
      }
      fs.writeFileSync(`${sourcePath}.ce`, ceMsg);
    }

    console.log(verdict);
    verdicts.push(verdict);

    fs.unlinkSync(copyFilePath);

  }
  fs.writeFileSync(paths.problemsetVerdictsPath(problemsetId), JSON.stringify(verdicts, undefined, 2));
}

function judgeAll(runningProblemsetConfigId: string) {
  let problemsetIds: string[];

  if (runningProblemsetConfigId === undefined) {
    problemsetIds = getProblemsetList().map(problemset => problemset.id);
    console.log('start judging all the problemset ******** ');
  } else {
    console.log(`start judgeing problemsets from ${runningProblemsetConfigId}`);
    problemsetIds = JSON.parse(fs.readFileSync(paths.runningProblemsetConfigPath(runningProblemsetConfigId),
      'utf8'));
  }

  problemsetIds.forEach(problemsetId => judgeProblemSet(problemsetId));
}

const dockerStr = systemSync('docker ps -a');

if (dockerStr.indexOf(containerName) > -1) {
  systemSync(`docker stop ${containerName}`);
  systemSync(`docker rm ${containerName}`);
}

systemSync(`docker run -dit --name ${containerName} -v ${path.resolve(localRoot)}:${dockerRoot}:ro ${imageName}`);

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
