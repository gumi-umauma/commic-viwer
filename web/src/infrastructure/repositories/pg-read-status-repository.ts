import { Pool } from "pg";
import { ReadStatusRepository } from "@/domain/repositories/read-status-repository";
import { UserId } from "@/domain/value-objects/user-id";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeId } from "@/domain/value-objects/volume-id";
import {
  findReadVolumeIdsByUserAndComic,
  findReadStatus,
  insertReadStatus,
  deleteReadStatus,
} from "@/infrastructure/db/read_status_sql";

export class PgReadStatusRepository implements ReadStatusRepository {
  constructor(private readonly pool: Pool) {}

  async findReadVolumeIds(
    userId: UserId,
    comicId: ComicId
  ): Promise<VolumeId[]> {
    const rows = await findReadVolumeIdsByUserAndComic(this.pool, {
      userId: userId.value,
      comicId: comicId.value,
    });
    return rows.map((row) => VolumeId.create(row.volumeId));
  }

  async markAsRead(userId: UserId, volumeId: VolumeId): Promise<void> {
    await insertReadStatus(this.pool, {
      userId: userId.value,
      volumeId: volumeId.value,
    });
  }

  async markAsUnread(userId: UserId, volumeId: VolumeId): Promise<void> {
    await deleteReadStatus(this.pool, {
      userId: userId.value,
      volumeId: volumeId.value,
    });
  }

  async isRead(userId: UserId, volumeId: VolumeId): Promise<boolean> {
    const row = await findReadStatus(this.pool, {
      userId: userId.value,
      volumeId: volumeId.value,
    });
    return row !== null;
  }
}
