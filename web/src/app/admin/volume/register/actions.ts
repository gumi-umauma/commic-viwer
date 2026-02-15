"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { RegisterVolumeUseCase } from "@/application/usecases/register-volume";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";

export async function getSourceFolders(): Promise<{
  success: boolean;
  folders?: string[];
  error?: string;
}> {
  try {
    const pageFileScanner =
      container.resolve<PageFileScanner>("pageFileScanner");
    const folders = await pageFileScanner.listSourceDirectories();
    return { success: true, folders };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function getDefaultVolumeNumber(
  comicId: string
): Promise<{ success: boolean; defaultVolumeNumber?: number; error?: string }> {
  try {
    const getComicDetailUseCase =
      container.resolve<GetComicDetailUseCase>("getComicDetailUseCase");
    const comic = await getComicDetailUseCase.execute(comicId);
    if (!comic) {
      return { success: false, error: "漫画が見つかりません" };
    }
    const maxVolumeNumber =
      comic.volumes.length > 0
        ? Math.max(...comic.volumes.map((v) => v.volumeNumber))
        : 0;
    return { success: true, defaultVolumeNumber: maxVolumeNumber + 1 };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function registerVolume(
  comicId: string,
  volumeNumber: number,
  sourceFolderName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = container.resolve<RegisterVolumeUseCase>(
      "registerVolumeUseCase"
    );
    await useCase.execute({ comicId, volumeNumber, sourceFolderName });

    revalidatePath(`/admin/comic/${comicId}`);
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
