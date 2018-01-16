export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 6;

export interface User {
  username: string;
  email: string;
  password: string;
  invitationCode: string;
  fullName: string;
  nickname: string;
  anonymous: boolean;
}

export interface UserSettings {
  nickname: string;
  anonymous: boolean;
}
