"use server";

import { container } from "@/infrastructure/container";
import { RegisterUserUseCase } from "@/application/usecases/register-user";

export async function registerUser(
  loginId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<RegisterUserUseCase>(
      "registerUserUseCase"
    );
    await useCase.execute(loginId, password);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
