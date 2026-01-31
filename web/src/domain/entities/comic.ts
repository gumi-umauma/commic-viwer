import { ComicId } from "@/domain/value-objects/comic-id";

export class Comic {
  private readonly _id: ComicId;
  private _title: string;

  private constructor(id: ComicId, title: string) {
    this._id = id;
    this._title = title;
  }

  static create(id: ComicId, title: string): Comic {
    if (!title || title.trim() === "") {
      throw new Error("Title cannot be empty");
    }
    return new Comic(id, title);
  }

  static reconstruct(id: ComicId, title: string): Comic {
    return new Comic(id, title);
  }

  get id(): ComicId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  equals(other: Comic): boolean {
    return this._id.equals(other._id);
  }
}
