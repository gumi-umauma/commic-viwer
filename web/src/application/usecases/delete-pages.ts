import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";

export class DeletePagesUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(
    comicId: string,
    volumeNumber: number,
    pageNumbers: number[]
  ): Promise<void> {
    if (pageNumbers.length === 0) {
      throw new Error("削除するページを選択してください");
    }

    const cid = ComicId.create(comicId);
    const vnum = VolumeNumber.create(volumeNumber);

    const comic = await this.comicRepository.findById(cid);
    if (!comic) {
      throw new Error("漫画が見つかりません");
    }

    const volume = await this.volumeRepository.findByComicIdAndNumber(
      cid,
      vnum
    );
    if (!volume) {
      throw new Error("巻が見つかりません");
    }

    const directoryPath = this.pageFileScanner.buildDirectoryPath(
      comic.title,
      volume.volumeNumber.value
    );

    await this.pageFileScanner.deletePagesAndRenumber(
      directoryPath,
      pageNumbers
    );
  }
}
