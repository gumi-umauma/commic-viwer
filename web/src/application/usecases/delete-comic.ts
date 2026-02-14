import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";

export class DeleteComicUseCase {
  constructor(private readonly comicRepository: ComicRepository) {}

  async execute(comicId: string): Promise<void> {
    const id = ComicId.create(comicId);
    const comic = await this.comicRepository.findById(id);
    if (!comic) {
      throw new Error("Comic not found");
    }

    await this.comicRepository.delete(id);
  }
}
