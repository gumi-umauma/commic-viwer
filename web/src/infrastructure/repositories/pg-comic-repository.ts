import { Pool } from "pg";
import { Comic } from "@/domain/entities/comic";
import { ComicRepository } from "@/domain/repositories/comic-repository";
import { ComicId } from "@/domain/value-objects/comic-id";
import { findAllComics } from "@/infrastructure/db/comic_sql";

export class PgComicRepository implements ComicRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Comic[]> {
    const rows = await findAllComics(this.pool);
    return rows.map((row) => Comic.reconstruct(ComicId.create(row.id), row.title));
  }
}
