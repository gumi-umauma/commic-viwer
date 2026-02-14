import { createContainer, asFunction, asValue } from "awilix";
import { Pool } from "pg";
import { GetComicsUseCase } from "@/application/usecases/get-comics";
import { GetAdminComicsUseCase } from "@/application/usecases/get-admin-comics";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { GetVolumeViewerUseCase } from "@/application/usecases/get-volume-viewer";
import { UpdateComicTitleUseCase } from "@/application/usecases/update-comic-title";
import { RegisterComicUseCase } from "@/application/usecases/register-comic";
import { RegisterComicFromExistingFolderUseCase } from "@/application/usecases/register-comic-from-existing-folder";
import { PgComicRepository } from "@/infrastructure/repositories/pg-comic-repository";
import { PgVolumeRepository } from "@/infrastructure/repositories/pg-volume-repository";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { pool } from "@/infrastructure/db/client";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export interface Cradle {
  pool: Pool;
  comicRepository: PgComicRepository;
  volumeRepository: PgVolumeRepository;
  pageFileScanner: PageFileScanner;
  getComicsUseCase: GetComicsUseCase;
  getAdminComicsUseCase: GetAdminComicsUseCase;
  getComicDetailUseCase: GetComicDetailUseCase;
  getVolumeViewerUseCase: GetVolumeViewerUseCase;
  updateComicTitleUseCase: UpdateComicTitleUseCase;
  registerComicUseCase: RegisterComicUseCase;
  registerComicFromExistingFolderUseCase: RegisterComicFromExistingFolderUseCase;
}

const container = createContainer<Cradle>();

container.register({
  pool: asValue(pool),
  comicRepository: asFunction(
    (cradle: Cradle) => new PgComicRepository(cradle.pool)
  ).singleton(),
  volumeRepository: asFunction(
    (cradle: Cradle) => new PgVolumeRepository(cradle.pool)
  ).singleton(),
  pageFileScanner: asFunction(
    () => new PageFileScanner(getRequiredEnv("MANGA_DATA_DIR"))
  ).singleton(),
  getComicsUseCase: asFunction(
    (cradle: Cradle) => new GetComicsUseCase(cradle.comicRepository)
  ).scoped(),
  getAdminComicsUseCase: asFunction(
    (cradle: Cradle) => new GetAdminComicsUseCase(cradle.comicRepository)
  ).scoped(),
  getComicDetailUseCase: asFunction(
    (cradle: Cradle) =>
      new GetComicDetailUseCase(cradle.comicRepository, cradle.volumeRepository)
  ).scoped(),
  getVolumeViewerUseCase: asFunction(
    (cradle: Cradle) =>
      new GetVolumeViewerUseCase(
        cradle.comicRepository,
        cradle.volumeRepository,
        cradle.pageFileScanner
      )
  ).scoped(),
  updateComicTitleUseCase: asFunction(
    (cradle: Cradle) => new UpdateComicTitleUseCase(cradle.comicRepository)
  ).scoped(),
  registerComicUseCase: asFunction(
    (cradle: Cradle) =>
      new RegisterComicUseCase(cradle.comicRepository, cradle.pageFileScanner)
  ).scoped(),
  registerComicFromExistingFolderUseCase: asFunction(
    (cradle: Cradle) =>
      new RegisterComicFromExistingFolderUseCase(
        cradle.comicRepository,
        cradle.volumeRepository,
        cradle.pageFileScanner
      )
  ).scoped(),
});

export { container };
