"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { RegisterVolumeUseCase } from "@/application/usecases/register-volume";
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
