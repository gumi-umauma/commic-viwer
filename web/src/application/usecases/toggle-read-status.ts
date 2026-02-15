import { ReadStatusRepository } from "@/domain/repositories/read-status-repository";
import { UserId } from "@/domain/value-objects/user-id";
import { VolumeId } from "@/domain/value-objects/volume-id";

export class ToggleReadStatusUseCase {
  constructor(
    private readonly readStatusRepository: ReadStatusRepository
  ) {}

  async execute(userId: string, volumeId: string): Promise<boolean> {
    const uid = UserId.create(userId);
    const vid = VolumeId.create(volumeId);

    const currentlyRead = await this.readStatusRepository.isRead(uid, vid);

    if (currentlyRead) {
      await this.readStatusRepository.markAsUnread(uid, vid);
    } else {
      await this.readStatusRepository.markAsRead(uid, vid);
    }

    return !currentlyRead;
  }
}
