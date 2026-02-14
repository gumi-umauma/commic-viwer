export class VolumeId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): VolumeId {
    if (!value || value.trim() === "") {
      throw new Error("VolumeId cannot be empty");
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
