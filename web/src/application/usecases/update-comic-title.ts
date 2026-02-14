import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";

export class UpdateComicTitleUseCase {
  constructor(
    private readonly comicRepository: ComicRepository,
    private readonly pageFileScanner: PageFileScanner
  ) {}

  async execute(comicId: string, newTitle: string): Promise<void> {
    const id = ComicId.create(comicId);
    const comic = await this.comicRepository.findById(id);
    if (!comic) {
      throw new Error("Comic not found");
    }

    const trimmedTitle = newTitle.trim();

    const existing = await this.comicRepository.findByTitle(trimmedTitle);
    if (existing && !existing.id.equals(comic.id)) {
      throw new Error("同じタイトルの漫画が既に存在します");
    }

    const oldTitle = comic.title;
    comic.changeTitle(trimmedTitle);
    await this.comicRepository.save(comic);
    await this.pageFileScanner.renameComicDirectory(oldTitle, trimmedTitle);
  }
}
