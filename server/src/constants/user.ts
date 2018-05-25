export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

export interface User {
  email: string; // primary key
  username: string; // also a primary key; users signup with emails, but allow to create non-conflicting username
  password: string;
  invitationCode: string;
  fullName: string;
  nickname: string;

  groups?: string[];
  invited?: boolean;
}

export interface UserSettings {
  fullName: string;
  nickname: string;
}

export interface UserDict {
  [username: string]: User;
}

export interface UserSession {
  username: string;
  startTime: string;
  endTime: string;
}
