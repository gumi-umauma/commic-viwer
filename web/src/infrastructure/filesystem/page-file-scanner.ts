import { mkdir, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]);

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

export class PageFileScanner {
  constructor(private readonly mangaDataDir: string) {}

  buildDirectoryPath(comicTitle: string, volumeNumber: number): string {
    const paddedNumber = String(volumeNumber).padStart(3, "0");
    return path.join(comicTitle, paddedNumber);
  }

  async scanPages(directoryPath: string): Promise<string[]> {
    const absoluteDir = path.resolve(this.mangaDataDir, directoryPath);

    if (!absoluteDir.startsWith(path.resolve(this.mangaDataDir))) {
      throw new Error("Invalid directory path");
    }

    if (!existsSync(absoluteDir)) {
      return [];
    }

    const entries = await readdir(absoluteDir);
    return entries
      .filter(isImageFile)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  async createComicDirectory(comicTitle: string): Promise<void> {
    const absoluteDir = path.resolve(this.mangaDataDir, comicTitle);

    if (!absoluteDir.startsWith(path.resolve(this.mangaDataDir))) {
      throw new Error("Invalid directory path");
    }

    await mkdir(absoluteDir, { recursive: true });
  }

  async listComicDirectories(): Promise<string[]> {
    const absoluteDir = path.resolve(this.mangaDataDir);
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  async scanVolumeDirectories(comicTitle: string): Promise<number[]> {
    const absoluteDir = path.resolve(this.mangaDataDir, comicTitle);

    if (!absoluteDir.startsWith(path.resolve(this.mangaDataDir))) {
      throw new Error("Invalid directory path");
    }

    if (!existsSync(absoluteDir)) {
      return [];
    }

    const entries = await readdir(absoluteDir, { withFileTypes: true });
    const volumePattern = /^\d{3}$/;

    return entries
      .filter((entry) => entry.isDirectory() && volumePattern.test(entry.name))
      .map((entry) => parseInt(entry.name, 10))
      .sort((a, b) => a - b);
  }

  getAbsolutePath(directoryPath: string, filename: string): string {
    const absolutePath = path.resolve(
      this.mangaDataDir,
      directoryPath,
      filename
    );

    if (!absolutePath.startsWith(path.resolve(this.mangaDataDir))) {
      throw new Error("Invalid file path");
    }

    return absolutePath;
  }
}
