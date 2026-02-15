import { UserRepository } from "@/domain/repositories/user-repository";
import { PasswordService } from "@/infrastructure/auth/password-service";

export type LoginResult =
  | { success: true; loginId: string }
  | { success: false; error: string };

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(loginId: string, password: string): Promise<LoginResult> {
    const user = await this.userRepository.findByLoginId(loginId);
    if (!user) {
      return { success: false, error: "IDまたはパスワードが正しくありません" };
    }

    const valid = await this.passwordService.verify(
      password,
      user.passwordHash
    );
    if (!valid) {
      return { success: false, error: "IDまたはパスワードが正しくありません" };
    }

    return { success: true, loginId: user.loginId };
  }
}
