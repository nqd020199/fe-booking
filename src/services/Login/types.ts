export type LoginTypes = {
  user_name: string;
  _password: string;
};

export type SignUpTypes = {
  user_name?: string;
  _password?: string;
  email?: string;
  image?: string;
};

export type ForgotServiceType = {
  email: string
};
export type ChangePassServiceType = {
  code_verify: string;
  _password: string;
  email: string;
};

export type OptionDept = {
  id_derp?: number;
  value: number;
  label: string;
  id_user?: number;
  email_depart: string;
  phoneNumber: string;
  domain?: string;
  addition?: string;
  slug?: string;
  sub_name?: string;
};
