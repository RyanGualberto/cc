import { createUser } from "../schemas/user";
import { User as UserRepository } from "../repositories/user";
import { generateToken } from "../services/jwt";

export class User {
  private repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }

  public async create(payload: createUser) {
    const user = await this.repository.create(payload);

    return {
      user,
      token: generateToken({ id: user.id }),
    };
  }
}
