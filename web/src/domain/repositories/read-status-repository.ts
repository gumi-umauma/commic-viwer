import { UserId } from "@/domain/value-objects/user-id";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeId } from "@/domain/value-objects/volume-id";

export interface ReadStatusRepository {
  findReadVolumeIds(userId: UserId, comicId: ComicId): Promise<VolumeId[]>;
  markAsRead(userId: UserId, volumeId: VolumeId): Promise<void>;
  markAsUnread(userId: UserId, volumeId: VolumeId): Promise<void>;
  isRead(userId: UserId, volumeId: VolumeId): Promise<boolean>;
}
