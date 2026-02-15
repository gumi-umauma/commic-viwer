import { UserId } from "@/domain/value-objects/user-id";

export class User {
  private readonly _id: UserId;
  private readonly _loginId: string;
  private readonly _passwordHash: string;
  private readonly _createdAt: Date;

  private constructor(id: UserId, loginId: string, passwordHash: string, createdAt: Date) {
    this._id = id;
    this._loginId = loginId;
    this._passwordHash = passwordHash;
    this._createdAt = createdAt;
  }

  static create(id: UserId, loginId: string, passwordHash: string): User {
    if (!loginId || loginId.trim() === "") {
      throw new Error("ログインIDを入力してください");
    }
    return new User(id, loginId, passwordHash, new Date());
  }

  static reconstruct(id: UserId, loginId: string, passwordHash: string, createdAt: Date): User {
    return new User(id, loginId, passwordHash, createdAt);
  }

  get id(): UserId {
    return this._id;
  }

  get loginId(): string {
    return this._loginId;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  equals(other: User): boolean {
    return this._id.equals(other._id);
  }
}
