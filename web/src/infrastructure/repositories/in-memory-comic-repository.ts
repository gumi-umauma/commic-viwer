import { Comic } from "@/domain/entities/comic";
import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";

export class InMemoryComicRepository implements ComicRepository {
  private readonly comics: Comic[] = [
    Comic.reconstruct(ComicId.create("1"), "ワンピース"),
    Comic.reconstruct(ComicId.create("2"), "鬼滅の刃"),
    Comic.reconstruct(ComicId.create("3"), "呪術廻戦"),
  ];

  async findAll(): Promise<Comic[]> {
    return Promise.resolve(this.comics);
  }
}
