export class ComicId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): ComicId {
    if (!value || value.trim() === "") {
      throw new Error("ComicId cannot be empty");
    }
    return new ComicId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ComicId): boolean {
    return this._value === other._value;
  }
}
