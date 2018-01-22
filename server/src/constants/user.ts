export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;

export interface User {
  email: string; // primary key
  username: string; // also a primary key; users signup with emails, but allow to create non-conflicting username
  password: string;
  invitationCode: string;
  fullName: string;
  nickname: string;
  anonymous: boolean;

  admin?: boolean;
}

export interface UserSettings {
  nickname: string;
  anonymous: boolean;
}

export interface UserDict {
  [username: string]: User;
}
