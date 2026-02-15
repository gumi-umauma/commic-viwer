"use server";

import { redirect } from "next/navigation";
import { container } from "@/infrastructure/container";
import { RegisterUserUseCase } from "@/application/usecases/register-user";
import { DeleteUserUseCase } from "@/application/usecases/delete-user";

export async function registerUser(
  loginId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<RegisterUserUseCase>(
      "registerUserUseCase"
    );
    await useCase.execute(loginId, password);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
  redirect("/admin/user");
}

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<DeleteUserUseCase>("deleteUserUseCase");
    await useCase.execute(userId);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
  redirect("/admin/user");
}
