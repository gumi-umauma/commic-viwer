import { ulid } from "ulidx";

export class UserId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static generate(): UserId {
    return new UserId(ulid());
  }

  static create(value: string): UserId {
    if (!value || value.trim() === "") {
      throw new Error("UserId cannot be empty");
    }
    if (!/^[0-9A-HJKMNP-TV-Z]{26}$/.test(value)) {
      throw new Error("UserId must be a valid ULID (26 characters)");
    }
    return new UserId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: UserId): boolean {
    return this._value === other._value;
  }
}
