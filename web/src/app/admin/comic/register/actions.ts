"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/infrastructure/container";
import { RegisterComicUseCase } from "@/application/usecases/register-comic";
import { RegisterComicFromExistingFolderUseCase } from "@/application/usecases/register-comic-from-existing-folder";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { ComicRepository } from "@/domain/repositories/comic-repository";

export async function registerComic(
  title: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const useCase = container.resolve<RegisterComicUseCase>(
      "registerComicUseCase"
    );
    const result = await useCase.execute(title);
    revalidatePath("/admin/comics");
    return { success: true, id: result.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function getUnregisteredFolders(): Promise<{
  success: boolean;
  folders?: string[];
  error?: string;
}> {
  try {
    const pageFileScanner =
      container.resolve<PageFileScanner>("pageFileScanner");
    const comicRepository =
      container.resolve<ComicRepository>("comicRepository");

    const allFolders = await pageFileScanner.listComicDirectories();
    const allComics = await comicRepository.findAll();
    const registeredTitles = new Set(allComics.map((c) => c.title));

    const unregisteredFolders = allFolders.filter(
      (folder) => !registeredTitles.has(folder)
    );

    return { success: true, folders: unregisteredFolders };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function getDetectedVolumes(
  folderName: string
): Promise<{ success: boolean; volumes?: number[]; error?: string }> {
  try {
    const pageFileScanner =
      container.resolve<PageFileScanner>("pageFileScanner");
    const volumes = await pageFileScanner.scanVolumeDirectories(folderName);
    return { success: true, volumes };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function registerComicFromExistingFolder(
  folderName: string
): Promise<{
  success: boolean;
  id?: string;
  volumeCount?: number;
  error?: string;
}> {
  try {
    const useCase =
      container.resolve<RegisterComicFromExistingFolderUseCase>(
        "registerComicFromExistingFolderUseCase"
      );
    const result = await useCase.execute(folderName);
    revalidatePath("/admin/comics");
    return { success: true, id: result.id, volumeCount: result.volumeCount };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: message };
  }
}
