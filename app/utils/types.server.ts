export interface Profile {
  firstName?: string;
  lastName?: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  profile?: Profile;
}

export interface LoginForm {
  email: string;
  password: string;
}
