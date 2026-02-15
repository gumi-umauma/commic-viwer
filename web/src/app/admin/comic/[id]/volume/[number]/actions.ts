"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { DeleteVolumeUseCase } from "@/application/usecases/delete-volume";
import { DeletePagesUseCase } from "@/application/usecases/delete-pages";

export async function deleteVolume(
  comicId: string,
  volumeNumber: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase =
      container.resolve<DeleteVolumeUseCase>("deleteVolumeUseCase");
    await useCase.execute(comicId, volumeNumber);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }

  revalidatePath(`/admin/comic/${comicId}`);
  redirect(`/admin/comic/${comicId}`);
}

export async function deletePages(
  comicId: string,
  volumeNumber: number,
  pageNumbers: number[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase =
      container.resolve<DeletePagesUseCase>("deletePagesUseCase");
    await useCase.execute(comicId, volumeNumber, pageNumbers);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }

  revalidatePath(`/admin/comic/${comicId}/volume/${volumeNumber}`);
  return { success: true };
}
