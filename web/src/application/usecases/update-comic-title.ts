import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";

export class UpdateComicTitleUseCase {
  constructor(private readonly comicRepository: ComicRepository) {}

  async execute(comicId: string, newTitle: string): Promise<void> {
    const id = ComicId.create(comicId);
    const comic = await this.comicRepository.findById(id);
    if (!comic) {
      throw new Error("Comic not found");
    }

    comic.changeTitle(newTitle);
    await this.comicRepository.save(comic);
  }
}
