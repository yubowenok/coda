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
  isAdmin: boolean;
}

export interface UserSettings {
  fullName: string;
  nickname: string;
}
