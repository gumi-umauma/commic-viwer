import { ulid } from "ulidx";

export class VolumeId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static generate(): VolumeId {
    return new VolumeId(ulid());
  }

  static create(value: string): VolumeId {
    if (!value || value.trim() === "") {
      throw new Error("VolumeId cannot be empty");
    }
    if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(value)) {
      throw new Error("VolumeId must be a valid ULID (26 characters)");
    }
    return new VolumeId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: VolumeId): boolean {
    return this._value === other._value;
  }
}
