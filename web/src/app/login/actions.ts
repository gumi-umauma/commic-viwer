"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { container } from "@/infrastructure/container";
import { LoginUseCase } from "@/application/usecases/login";
import { CookieSessionService } from "@/infrastructure/auth/cookie-session-service";

export async function loginAction(
  loginId: string,
  password: string
): Promise<{ error?: string } | undefined> {
  const useCase = container.resolve<LoginUseCase>("loginUseCase");
  const result = await useCase.execute(loginId, password);

  if (!result.success) {
    return { error: result.error };
  }

  const sessionService = container.resolve<CookieSessionService>(
    "cookieSessionService"
  );
  const cookieValue = sessionService.sign(result.loginId);

  const cookieStore = await cookies();
  cookieStore.set("session", cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30日
  });

  redirect("/comics");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}
