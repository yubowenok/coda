import * as child_process from 'child_process';
const imageName = process.env.IMAGE_NAME || 'szfck/nyu-problemtools:1.0.4';

function systemSync(cmd: string) {
  try {
    return child_process.execSync(cmd).toString();
  } catch (err) {
    console.error('systemSync failed', err);
  }
}

systemSync(`docker pull ${imageName}`);

console.log(`Docker image init finished`);
