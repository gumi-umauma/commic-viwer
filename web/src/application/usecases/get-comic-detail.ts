import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";

export type VolumeListItemDto = {
  id: string;
  volumeNumber: number;
};

export type ComicDetailDto = {
  id: string;
  title: string;
  volumes: VolumeListItemDto[];
};

export class GetComicDetailUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository
  ) {}

  async execute(comicId: string): Promise<ComicDetailDto | null> {
    const id = ComicId.create(comicId);
    const comic = await this.comicRepository.findById(id);
    if (!comic) return null;

    const volumes = await this.volumeRepository.findByComicId(id);

    return {
      id: comic.id.value,
      title: comic.title,
      volumes: volumes.map((v) => ({
        id: v.id.value,
        volumeNumber: v.volumeNumber.value,
      })),
    };
  }
}
