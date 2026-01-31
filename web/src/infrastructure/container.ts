import { createContainer, asFunction, asValue } from "awilix";
import { Pool } from "pg";
import { GetComicsUseCase } from "@/application/usecases/get-comics";
import { PgComicRepository } from "@/infrastructure/repositories/pg-comic-repository";
import { pool } from "@/infrastructure/db/client";

export interface Cradle {
  pool: Pool;
  comicRepository: PgComicRepository;
  getComicsUseCase: GetComicsUseCase;
}

const container = createContainer<Cradle>();

container.register({
  pool: asValue(pool),
  comicRepository: asFunction(
    (cradle: Cradle) => new PgComicRepository(cradle.pool)
  ).singleton(),
  getComicsUseCase: asFunction(
    (cradle: Cradle) => new GetComicsUseCase(cradle.comicRepository)
  ).scoped(),
});

export { container };
