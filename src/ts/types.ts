export type TRegister = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type TCredential = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  captchaToken: string;
};

export type TEditedCredential = {
  email: string;
  first_name: string;
  last_name: string;
  auth_user_id: string;
  param_user_id: string | undefined;
};

export type ICategory = {
  user_id: string;
  category_name: string;
};

export type TLogin = {
  email: string;
  password: string;
  captchaToken: string;
};

export type TInput = {
  type: string;
  text: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  name: string;
  min: number | undefined;
  max: number | undefined;
};

export type TPostScore = {
  games_id: number;
  user_id: string;
  score: number;
};

type IUser = {
  first_name: string;
  last_name: string;
};

export type IScoreData = {
  score_id: number;
  games_id: number;
  user_id: string;
  score: number;
  timestamp: Date;
  users: IUser;
};

export interface ExploreProps {
  scoreData?: IScoreData[];
}
