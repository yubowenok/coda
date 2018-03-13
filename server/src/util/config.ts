import * as fs from 'fs';
import { SystemConfig } from '../constants/config';
import * as paths from '../constants/path';

export const getSystemConfig = (): SystemConfig => {
  const configFile = paths.systemConfigPath();
  if (!fs.existsSync(configFile)) {
    return {}; // no config given
  }
  const systemConfig: SystemConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  return systemConfig;
};
