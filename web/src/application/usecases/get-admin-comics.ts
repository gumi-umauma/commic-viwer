import { Comic } from "@/domain/entities/comic";
import { ComicRepository } from "@/domain/repositories/comic-repository";

export type AdminComicDto = {
  id: string;
  title: string;
};

export class GetAdminComicsUseCase {
  constructor(private readonly comicRepository: ComicRepository) {}

  async execute(): Promise<AdminComicDto[]> {
    const comics: Comic[] = await this.comicRepository.findAll();
    return comics.map((comic) => ({
      id: comic.id.value,
      title: comic.title,
    }));
  }
}
