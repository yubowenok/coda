export interface SignupInfo {
  invitationCode: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInfo {
  username: string;
  password: string;
}

export interface UserInfo {
  email: string;
  username: string;
  fullName: string;
  nickname: string;
}

export interface UserSettings {
  nickname: string;
  anonymous: boolean;
}