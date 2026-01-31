import { Comic } from "@/domain/entities/comic";

export interface ComicRepository {
  findAll(): Promise<Comic[]>;
}
