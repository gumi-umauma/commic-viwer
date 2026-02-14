import { ulid } from "ulidx";

export class ComicId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static generate(): ComicId {
    return new ComicId(ulid());
  }

  static create(value: string): ComicId {
    if (!value || value.trim() === "") {
      throw new Error("ComicId cannot be empty");
    }
    if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(value)) {
      throw new Error("ComicId must be a valid ULID (26 characters)");
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
