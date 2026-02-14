export class VolumeNumber {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): VolumeNumber {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error("VolumeNumber must be a positive integer");
    }
    return new VolumeNumber(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: VolumeNumber): boolean {
    return this._value === other._value;
  }
}
