import { ComicId } from "@/domain/value-objects/comic-id";

const FORBIDDEN_CHARS = /[\\/:*?"<>|]/;

export class Comic {
  private readonly _id: ComicId;
  private _title: string;

  private constructor(id: ComicId, title: string) {
    this._id = id;
    this._title = title;
  }

  private static validateTitle(title: string): void {
    if (!title || title.trim() === "") {
      throw new Error("Title cannot be empty");
    }
    if (FORBIDDEN_CHARS.test(title)) {
      throw new Error(
        'タイトルに使用できない文字が含まれています: \\ / : * ? " < > |'
      );
    }
  }

  static create(id: ComicId, title: string): Comic {
    Comic.validateTitle(title);
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

  changeTitle(newTitle: string): void {
    Comic.validateTitle(newTitle);
    this._title = newTitle;
  }

  equals(other: Comic): boolean {
    return this._id.equals(other._id);
  }
}
