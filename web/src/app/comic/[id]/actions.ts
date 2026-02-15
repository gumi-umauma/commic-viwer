"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { ToggleReadStatusUseCase } from "@/application/usecases/toggle-read-status";
import { getCurrentUserId } from "@/app/lib/session";

export async function toggleReadStatus(
  comicId: string,
  volumeId: string
): Promise<{ success: boolean; isRead: boolean; error?: string }> {
  try {
    const userId = await getCurrentUserId();
    const useCase = container.resolve<ToggleReadStatusUseCase>(
      "toggleReadStatusUseCase"
    );
    const isRead = await useCase.execute(userId, volumeId);
    revalidatePath(`/comic/${comicId}`);
    return { success: true, isRead };
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    return { success: false, isRead: false, error: message };
  }
}
