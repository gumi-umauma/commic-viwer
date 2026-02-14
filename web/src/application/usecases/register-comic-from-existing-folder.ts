import { Comic } from "@/domain/entities/comic";
import { Volume } from "@/domain/entities/volume";
import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeId } from "@/domain/value-objects/volume-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { randomUUID } from "crypto";

export interface RegisterComicFromExistingFolderResult {
  id: string;
  volumeCount: number;
}

export class RegisterComicFromExistingFolderUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(
    folderName: string
  ): Promise<RegisterComicFromExistingFolderResult> {
    const title = folderName.trim();
    if (!title) {
      throw new Error("フォルダを選択してください");
    }

    const existing = await this.comicRepository.findByTitle(title);
    if (existing) {
      throw new Error("同じタイトルの漫画が既に存在します");
    }

    const volumeNumbers =
      await this.pageFileScanner.scanVolumeDirectories(title);

    const comicId = ComicId.create(randomUUID());
    const comic = Comic.create(comicId, title);
    await this.comicRepository.insert(comic);

    for (const num of volumeNumbers) {
      const volumeId = VolumeId.create(randomUUID());
      const volumeNumber = VolumeNumber.create(num);
      const volume = Volume.create(volumeId, comicId, volumeNumber);
      await this.volumeRepository.insert(volume);
    }

    return {
      id: comicId.value,
      volumeCount: volumeNumbers.length,
    };
  }
}
