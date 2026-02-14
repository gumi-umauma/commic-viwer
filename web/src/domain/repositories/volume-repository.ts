import { Volume } from "@/domain/entities/volume";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";

export interface VolumeRepository {
  findByComicId(comicId: ComicId): Promise<Volume[]>;
  findByComicIdAndNumber(
    comicId: ComicId,
    number: VolumeNumber
  ): Promise<Volume | null>;
  insert(volume: Volume): Promise<void>;
}
