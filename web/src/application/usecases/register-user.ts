import { User } from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/user-repository";
import { UserId } from "@/domain/value-objects/user-id";
import { PasswordService } from "@/infrastructure/auth/password-service";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(loginId: string, password: string): Promise<void> {
    const existing = await this.userRepository.findByLoginId(loginId);
    if (existing) {
      throw new Error("このログインIDは既に使用されています");
    }

    const hash = await this.passwordService.hash(password);
    const user = User.create(UserId.generate(), loginId, hash);
    await this.userRepository.insert(user);
  }
}
