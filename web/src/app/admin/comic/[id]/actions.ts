"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { UpdateComicTitleUseCase } from "@/application/usecases/update-comic-title";
import { DeleteComicUseCase } from "@/application/usecases/delete-comic";

export async function updateComicTitle(
  comicId: string,
  newTitle: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<UpdateComicTitleUseCase>(
      "updateComicTitleUseCase"
    );
    await useCase.execute(comicId, newTitle);
    revalidatePath(`/admin/comic/${comicId}`);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function deleteComic(
  comicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<DeleteComicUseCase>(
      "deleteComicUseCase"
    );
    await useCase.execute(comicId);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }

  redirect("/admin/comics");
}
