import { UserRepository } from "@/domain/repositories/user-repository";

export interface UserDto {
  id: string;
  loginId: string;
}

export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id.value,
      loginId: user.loginId,
    }));
  }
}
