import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ReadStatusRepository } from "@/domain/repositories/read-status-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { UserId } from "@/domain/value-objects/user-id";

export type VolumeListItemDto = {
  id: string;
  volumeNumber: number;
  isRead: boolean;
};

export type ComicDetailDto = {
  id: string;
  title: string;
  volumes: VolumeListItemDto[];
};

export class GetComicDetailUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository,
    private readonly readStatusRepository: ReadStatusRepository
  ) {}

  async execute(
    comicId: string,
    userId?: string
  ): Promise<ComicDetailDto | null> {
    const id = ComicId.create(comicId);
    const comic = await this.comicRepository.findById(id);
    if (!comic) return null;

    const volumes = await this.volumeRepository.findByComicId(id);

    let readSet = new Set<string>();
    if (userId) {
      const uid = UserId.create(userId);
      const readVolumeIds =
        await this.readStatusRepository.findReadVolumeIds(uid, id);
      readSet = new Set(readVolumeIds.map((vid) => vid.value));
    }

    return {
      id: comic.id.value,
      title: comic.title,
      volumes: volumes.map((v) => ({
        id: v.id.value,
        volumeNumber: v.volumeNumber.value,
        isRead: readSet.has(v.id.value),
      })),
    };
  }
}
