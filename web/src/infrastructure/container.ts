import { createContainer, asFunction, asValue } from "awilix";
import { Pool } from "pg";
import { GetComicsUseCase } from "@/application/usecases/get-comics";
import { GetAdminComicsUseCase } from "@/application/usecases/get-admin-comics";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { GetVolumeViewerUseCase } from "@/application/usecases/get-volume-viewer";
import { UpdateComicTitleUseCase } from "@/application/usecases/update-comic-title";
import { RegisterComicUseCase } from "@/application/usecases/register-comic";
import { RegisterComicFromExistingFolderUseCase } from "@/application/usecases/register-comic-from-existing-folder";
import { DeleteComicUseCase } from "@/application/usecases/delete-comic";
import { RegisterVolumeUseCase } from "@/application/usecases/register-volume";
import { DeleteVolumeUseCase } from "@/application/usecases/delete-volume";
import { DeletePagesUseCase } from "@/application/usecases/delete-pages";
import { LoginUseCase } from "@/application/usecases/login";
import { RegisterUserUseCase } from "@/application/usecases/register-user";
import { GetUsersUseCase } from "@/application/usecases/get-users";
import { DeleteUserUseCase } from "@/application/usecases/delete-user";
import { ToggleReadStatusUseCase } from "@/application/usecases/toggle-read-status";
import { PgComicRepository } from "@/infrastructure/repositories/pg-comic-repository";
import { PgVolumeRepository } from "@/infrastructure/repositories/pg-volume-repository";
import { PgUserRepository } from "@/infrastructure/repositories/pg-user-repository";
import { PgReadStatusRepository } from "@/infrastructure/repositories/pg-read-status-repository";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { PasswordService } from "@/infrastructure/auth/password-service";
import { CookieSessionService } from "@/infrastructure/auth/cookie-session-service";
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
  deleteComicUseCase: DeleteComicUseCase;
  registerVolumeUseCase: RegisterVolumeUseCase;
  deleteVolumeUseCase: DeleteVolumeUseCase;
  deletePagesUseCase: DeletePagesUseCase;
  readStatusRepository: PgReadStatusRepository;
  userRepository: PgUserRepository;
  passwordService: PasswordService;
  cookieSessionService: CookieSessionService;
  loginUseCase: LoginUseCase;
  registerUserUseCase: RegisterUserUseCase;
  getUsersUseCase: GetUsersUseCase;
  deleteUserUseCase: DeleteUserUseCase;
  toggleReadStatusUseCase: ToggleReadStatusUseCase;
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
    () => new PageFileScanner(getRequiredEnv("COMIC_DATA_DIR"))
  ).singleton(),
  getComicsUseCase: asFunction(
    (cradle: Cradle) => new GetComicsUseCase(cradle.comicRepository)
  ).scoped(),
  getAdminComicsUseCase: asFunction(
    (cradle: Cradle) => new GetAdminComicsUseCase(cradle.comicRepository)
  ).scoped(),
  getComicDetailUseCase: asFunction(
    (cradle: Cradle) =>
      new GetComicDetailUseCase(cradle.comicRepository, cradle.volumeRepository, cradle.readStatusRepository)
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
    (cradle: Cradle) =>
      new UpdateComicTitleUseCase(cradle.comicRepository, cradle.pageFileScanner)
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
  deleteComicUseCase: asFunction(
    (cradle: Cradle) => new DeleteComicUseCase(cradle.comicRepository)
  ).scoped(),
  registerVolumeUseCase: asFunction(
    (cradle: Cradle) =>
      new RegisterVolumeUseCase(
        cradle.comicRepository,
        cradle.volumeRepository,
        cradle.pageFileScanner
      )
  ).scoped(),
  deleteVolumeUseCase: asFunction(
    (cradle: Cradle) =>
      new DeleteVolumeUseCase(cradle.comicRepository, cradle.volumeRepository)
  ).scoped(),
  deletePagesUseCase: asFunction(
    (cradle: Cradle) =>
      new DeletePagesUseCase(
        cradle.comicRepository,
        cradle.volumeRepository,
        cradle.pageFileScanner
      )
  ).scoped(),
  readStatusRepository: asFunction(
    (cradle: Cradle) => new PgReadStatusRepository(cradle.pool)
  ).singleton(),
  userRepository: asFunction(
    (cradle: Cradle) => new PgUserRepository(cradle.pool)
  ).singleton(),
  passwordService: asFunction(() => new PasswordService()).singleton(),
  cookieSessionService: asFunction(
    () => new CookieSessionService(getRequiredEnv("SESSION_SECRET"))
  ).singleton(),
  loginUseCase: asFunction(
    (cradle: Cradle) =>
      new LoginUseCase(cradle.userRepository, cradle.passwordService)
  ).scoped(),
  registerUserUseCase: asFunction(
    (cradle: Cradle) =>
      new RegisterUserUseCase(cradle.userRepository, cradle.passwordService)
  ).scoped(),
  getUsersUseCase: asFunction(
    (cradle: Cradle) => new GetUsersUseCase(cradle.userRepository)
  ).scoped(),
  deleteUserUseCase: asFunction(
    (cradle: Cradle) => new DeleteUserUseCase(cradle.userRepository)
  ).scoped(),
  toggleReadStatusUseCase: asFunction(
    (cradle: Cradle) =>
      new ToggleReadStatusUseCase(cradle.readStatusRepository)
  ).scoped(),
});

export { container };
