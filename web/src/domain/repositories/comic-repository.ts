import { Comic } from "@/domain/entities/comic";
import { ComicId } from "@/domain/value-objects/comic-id";

export interface ComicRepository {
  findAll(): Promise<Comic[]>;
  findAllWithVolumes(): Promise<Comic[]>;
  findById(id: ComicId): Promise<Comic | null>;
}
