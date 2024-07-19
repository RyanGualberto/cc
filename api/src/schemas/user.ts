import { AppError } from "../utils/appError";

export class UserCreateInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  cpf: string;
  [key: string]: string;

  constructor(data: UserCreateInput) {
    this.email = data.email;
    this.password = data.password;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.phone = data.phone;
    this.cpf = data.cpf;
  }

  static validate(data: UserCreateInput) {
    for (const key in data) {
      if (data[key] === undefined) {
        throw new AppError(`Missing required field: ${key}`, 400);
      }
    }

    return data;
  }
}

export class UserLoginInput {
  email: string | undefined;
  phone: string | undefined;
  cpf: string | undefined;
  password: string;
  [key: string]: string | undefined;

  constructor(data: UserLoginInput) {
    this.email = data.email;
    this.phone = data.phone;
    this.cpf = data.cpf;
    this.password = data.password;
  }

  static validate(data: UserLoginInput) {
    for (const key in data) {
      if (data[key] === undefined) {
        throw new AppError(`Missing required field: ${key}`, 400);
      }
    }

    return data;
  }
}
