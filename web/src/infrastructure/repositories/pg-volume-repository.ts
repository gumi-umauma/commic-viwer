import { Pool } from "pg";
import { Volume } from "@/domain/entities/volume";
import { VolumeRepository } from "@/domain/repositories/volume-repository";
import { VolumeId } from "@/domain/value-objects/volume-id";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";
import {
  findVolumesByComicId,
  findVolumeByComicIdAndNumber,
  insertVolume,
} from "@/infrastructure/db/volume_sql";

export class PgVolumeRepository implements VolumeRepository {
  constructor(private readonly pool: Pool) {}

  async findByComicId(comicId: ComicId): Promise<Volume[]> {
    const rows = await findVolumesByComicId(this.pool, {
      comicId: comicId.value,
    });
    return rows.map((row) =>
      Volume.reconstruct(
        VolumeId.create(row.id),
        ComicId.create(row.comicId),
        VolumeNumber.create(row.volumeNumber)
      )
    );
  }

  async findByComicIdAndNumber(
    comicId: ComicId,
    number: VolumeNumber
  ): Promise<Volume | null> {
    const row = await findVolumeByComicIdAndNumber(this.pool, {
      comicId: comicId.value,
      volumeNumber: number.value,
    });
    if (!row) return null;
    return Volume.reconstruct(
      VolumeId.create(row.id),
      ComicId.create(row.comicId),
      VolumeNumber.create(row.volumeNumber)
    );
  }

  async insert(volume: Volume): Promise<void> {
    await insertVolume(this.pool, {
      id: volume.id.value,
      comicId: volume.comicId.value,
      volumeNumber: volume.volumeNumber.value,
    });
  }
}
