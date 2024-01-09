export interface ProfileData {
  firstName?: string;
  lastName?: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  profile?: ProfileData;
}

export interface LoginForm {
  email: string;
  password: string;
}
