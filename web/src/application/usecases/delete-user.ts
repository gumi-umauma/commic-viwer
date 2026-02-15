import { UserRepository } from "@/domain/repositories/user-repository";
import { UserId } from "@/domain/value-objects/user-id";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const users = await this.userRepository.findAll();
    if (users.length <= 1) {
      throw new Error("ユーザーが1人のため削除できません");
    }

    const id = UserId.create(userId);
    await this.userRepository.delete(id);
  }
}
