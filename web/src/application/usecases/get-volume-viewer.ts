import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";

export type ViewerPageDto = {
  pageNumber: number;
  imageUrl: string;
};

export type VolumeViewerDto = {
  comicId: string;
  comicTitle: string;
  volumeNumber: number;
  pages: ViewerPageDto[];
};

export class GetVolumeViewerUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(
    comicId: string,
    volumeNumber: number
  ): Promise<VolumeViewerDto | null> {
    const cid = ComicId.create(comicId);
    const vnum = VolumeNumber.create(volumeNumber);

    const comic = await this.comicRepository.findById(cid);
    if (!comic) return null;

    const volume = await this.volumeRepository.findByComicIdAndNumber(
      cid,
      vnum
    );
    if (!volume) return null;

    const directoryPath = this.pageFileScanner.buildDirectoryPath(
      comic.title,
      volume.volumeNumber.value
    );
    const filenames = await this.pageFileScanner.scanPages(directoryPath);

    return {
      comicId: comic.id.value,
      comicTitle: comic.title,
      volumeNumber: volume.volumeNumber.value,
      pages: filenames.map((_, index) => ({
        pageNumber: index + 1,
        imageUrl: `/api/comic/${comic.id.value}/volume/${volume.volumeNumber.value}/page/${index + 1}`,
      })),
    };
  }
}
