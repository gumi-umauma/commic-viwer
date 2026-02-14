import { Comic } from "@/domain/entities/comic";
import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { randomUUID } from "crypto";

export interface RegisterComicResult {
  id: string;
}

export class RegisterComicUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(title: string): Promise<RegisterComicResult> {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error("タイトルを入力してください");
    }

    const existing = await this.comicRepository.findByTitle(trimmedTitle);
    if (existing) {
      throw new Error("同じタイトルの漫画が既に存在します");
    }

    const id = ComicId.create(randomUUID());
    const comic = Comic.create(id, trimmedTitle);

    await this.comicRepository.insert(comic);
    await this.pageFileScanner.createComicDirectory(trimmedTitle);

    return { id: id.value };
  }
}
