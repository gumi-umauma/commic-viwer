import { ComicRepository } from "@/domain/repositories/comic-repository";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";

export class DeleteVolumeUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly volumeRepository: VolumeRepository
  ) {}

  async execute(comicId: string, volumeNumber: number): Promise<void> {
    const cid = ComicId.create(comicId);
    const vnum = VolumeNumber.create(volumeNumber);

    const comic = await this.comicRepository.findById(cid);
    if (!comic) {
      throw new Error("Comic not found");
    }

    const volume = await this.volumeRepository.findByComicIdAndNumber(
      cid,
      vnum
    );
    if (!volume) {
      throw new Error("Volume not found");
    }

    await this.volumeRepository.deleteByComicIdAndNumber(cid, vnum);
  }
}
