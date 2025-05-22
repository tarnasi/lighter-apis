export interface CreateUserArgs {
  role: string;
  full_name: string;
  mobile: string;
  email: string;
  password: string;
  birthday: string;
  wholesaler: boolean;
}

export interface UserContext {
  user: {
    userId: string;
    role: string;
  } | null;
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  birthday?: string;
  wholesaler?: boolean;
}

export interface UpdateUserProfileInput {
  full_name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  birthday?: string;
  wholesaler?: boolean;
}

export interface ResetPasswordInput {
  new_password: string;
  confirm_password: string;
}

export type ExpressContextFunctionArgument = {
  req: Request;
  res: Response;
};
