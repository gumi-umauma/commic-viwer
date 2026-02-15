import { Volume } from "@/domain/entities/volume";
import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeId } from "@/domain/value-objects/volume-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";

export interface RegisterVolumeInput {
  comicId: string;
  volumeNumber: number;
  sourceFolderName: string;
}

export interface RegisterVolumeResult {
  id: string;
}

export class RegisterVolumeUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(input: RegisterVolumeInput): Promise<RegisterVolumeResult> {
    const comicId = ComicId.create(input.comicId);
    const comic = await this.comicRepository.findById(comicId);
    if (!comic) {
      throw new Error("漫画が見つかりません");
    }

    if (!input.sourceFolderName.trim()) {
      throw new Error("ソースフォルダを選択してください");
    }

    const volumeNumber = VolumeNumber.create(input.volumeNumber);

    const existing = await this.volumeRepository.findByComicIdAndNumber(
      comicId,
      volumeNumber
    );
    if (existing) {
      throw new Error(
        `第${volumeNumber.value}巻は既に登録されています`
      );
    }

    const volumeId = VolumeId.generate();
    const volume = Volume.create(volumeId, comicId, volumeNumber);

    await this.volumeRepository.insert(volume);
    await this.pageFileScanner.createVolumeDirectory(
      comic.title,
      volumeNumber.value
    );

    const copiedCount = await this.pageFileScanner.copyAndRenameImages(
      input.sourceFolderName,
      comic.title,
      volumeNumber.value
    );

    if (copiedCount === 0) {
      throw new Error(
        "対象の画像ファイルが見つかりません（対象拡張子: jpg, jpeg, png, webp）"
      );
    }

    await this.pageFileScanner.moveSourceToRegistered(input.sourceFolderName);

    return { id: volumeId.value };
  }
}
