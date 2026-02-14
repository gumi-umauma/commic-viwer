import { VolumeId } from "@/domain/value-objects/volume-id";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";

export class Volume {
  private readonly _id: VolumeId;
  private readonly _comicId: ComicId;
  private readonly _volumeNumber: VolumeNumber;

  private constructor(
    id: VolumeId,
    comicId: ComicId,
    volumeNumber: VolumeNumber
  ) {
    this._id = id;
    this._comicId = comicId;
    this._volumeNumber = volumeNumber;
  }

  static create(
    id: VolumeId,
    comicId: ComicId,
    volumeNumber: VolumeNumber
  ): Volume {
    return new Volume(id, comicId, volumeNumber);
  }

  static reconstruct(
    id: VolumeId,
    comicId: ComicId,
    volumeNumber: VolumeNumber
  ): Volume {
    return new Volume(id, comicId, volumeNumber);
  }

  get id(): VolumeId {
    return this._id;
  }

  get comicId(): ComicId {
    return this._comicId;
  }

  get volumeNumber(): VolumeNumber {
    return this._volumeNumber;
  }

  equals(other: Volume): boolean {
    return this._id.equals(other._id);
  }
}
