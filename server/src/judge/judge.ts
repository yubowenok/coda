import '../config/env';
import * as fs from 'fs';
import * as paths from '../constants/path';
import * as path from 'path';
import * as child_process from 'child_process';
import * as yargs from 'yargs';
import {
  ProblemConfig,
  ProblemsetConfig,
  ProblemScoring,
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
  getVerdictList,
  getSystemConfig
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
  const matched = contents.match(/public\s+class\s+([^{\s]+)/);
  return contents.substr(0, matched.index) +
    contents.substr(matched.index).replace(matched[1], name);
}

function judgeProblemSet(problemsetId: string) {
  // console.log(`judging problemsetId ${problemsetId}`);

  const problemset: ProblemsetConfig = getProblemset(problemsetId);
  const problems: ProblemScoring[] = problemset.problems;
  const submissions: Submission[] = getSubmissionList(problemsetId);
  const verdicts: Verdict[] = getVerdictList(problemsetId);

  const map: { [name: string]: string } = {};

  for (let i = 0; i < problems.length; i++) {
    map[problems[i].number] = problems[i].id;
  }

  const set: { [sourceFile: string]: any } = new Set();

  for (let i = 0; i < verdicts.length; i++) {
    set.add(verdicts[i].sourceFile);
  }
  let writeBackCnt = 0;
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
    const tmpFileName = judgeFileName + path.extname(sourceFile);
    const dockerSource = paths.dockerJudgeSourcePath(problemId, subtask, tmpFileName);
    const copyFilePath = paths.localJudgeSourcePath(problemId, subtask, tmpFileName);

    fs.writeFileSync(copyFilePath, content);

    console.log(`problemset: ${problemsetId}`);
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
      failedCaseName: result.failedCase.name,
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
    writeBackCnt++;
    // write back every 5 verdicts
    if (writeBackCnt >= 5) {
      fs.writeFileSync(paths.problemsetVerdictsPath(problemsetId), JSON.stringify(verdicts, undefined, 2));
      writeBackCnt = 0;
    }
  }
  if (writeBackCnt > 0) {
    fs.writeFileSync(paths.problemsetVerdictsPath(problemsetId), JSON.stringify(verdicts, undefined, 2));
  }
}

let judgeRound = 0;
function judgeAll(problemsets?: string[]) {
  let problemsetIds: string[];
  let logProblemsetIds: string;
  if (problemsets === undefined) {
    problemsetIds = getProblemsetList().map(problemset => problemset.id);
    logProblemsetIds = 'all';
  } else {
    problemsetIds = problemsets;
    logProblemsetIds = problemsets.join(',');
  }
  console.log(`Judging round ${++judgeRound}: ${logProblemsetIds}`);
  problemsetIds.forEach(problemsetId => judgeProblemSet(problemsetId));
}

const dockerStr = systemSync('docker ps -a');

if (dockerStr.indexOf(containerName) > -1) {
  systemSync(`docker stop ${containerName}`);
  systemSync(`docker rm ${containerName}`);
}

const dockerCmd = `docker run -dit --name ${containerName} ` +
  `-v ${path.resolve(localRoot)}:${dockerRoot}:ro ` +
  `-v ${path.resolve(localRoot)}/problem:${dockerRoot}/problem:ro ${imageName}`;
console.log(dockerCmd);
systemSync(dockerCmd);

const interval = yargs.argv.interval;
const judgeProblemsets = getSystemConfig().judgeProblemsets || undefined;

if (interval === undefined) {
  // run judge once
  judgeAll(judgeProblemsets);
} else {
  // run judge every interval seconds
  setInterval(function() {
    judgeAll(judgeProblemsets);
  }, interval * 1000);
}
