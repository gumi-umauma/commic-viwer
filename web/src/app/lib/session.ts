import { cookies } from "next/headers";
import { container } from "@/infrastructure/container";
import { CookieSessionService } from "@/infrastructure/auth/cookie-session-service";
import { PgUserRepository } from "@/infrastructure/repositories/pg-user-repository";

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    throw new Error("セッションが見つかりません");
  }

  const sessionService = container.resolve<CookieSessionService>(
    "cookieSessionService"
  );
  const loginId = sessionService.verify(sessionCookie);
  if (!loginId) {
    throw new Error("セッションが無効です");
  }

  const userRepository =
    container.resolve<PgUserRepository>("userRepository");
  const user = await userRepository.findByLoginId(loginId);
  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  return user.id.value;
}
