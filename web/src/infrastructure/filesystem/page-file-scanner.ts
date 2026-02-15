import { copyFile, mkdir, readdir, rename } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const WORK_DIR_NAME = "work";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

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

  async renameComicDirectory(
    oldTitle: string,
    newTitle: string
  ): Promise<void> {
    const oldDir = path.resolve(this.mangaDataDir, oldTitle);
    const newDir = path.resolve(this.mangaDataDir, newTitle);
    const baseDir = path.resolve(this.mangaDataDir);

    if (!oldDir.startsWith(baseDir) || !newDir.startsWith(baseDir)) {
      throw new Error("Invalid directory path");
    }

    if (!existsSync(oldDir)) {
      return;
    }

    await rename(oldDir, newDir);
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

  async createVolumeDirectory(
    comicTitle: string,
    volumeNumber: number
  ): Promise<void> {
    const dirPath = this.buildDirectoryPath(comicTitle, volumeNumber);
    const absoluteDir = path.resolve(this.mangaDataDir, dirPath);

    if (!absoluteDir.startsWith(path.resolve(this.mangaDataDir))) {
      throw new Error("Invalid directory path");
    }

    await mkdir(absoluteDir, { recursive: true });
  }

  async listSourceDirectories(): Promise<string[]> {
    const workDir = path.resolve(this.mangaDataDir, WORK_DIR_NAME);

    if (!existsSync(workDir)) {
      return [];
    }

    const entries = await readdir(workDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  async copyAndRenameImages(
    sourceFolderName: string,
    comicTitle: string,
    volumeNumber: number
  ): Promise<number> {
    const sourceDir = path.resolve(
      this.mangaDataDir,
      WORK_DIR_NAME,
      sourceFolderName
    );
    const baseWorkDir = path.resolve(this.mangaDataDir, WORK_DIR_NAME);

    if (!sourceDir.startsWith(baseWorkDir)) {
      throw new Error("Invalid source directory path");
    }

    if (!existsSync(sourceDir)) {
      throw new Error("ソースフォルダが見つかりません");
    }

    const entries = await readdir(sourceDir);
    const imageFiles = entries.filter(isImageFile).sort();

    if (imageFiles.length === 0) {
      return 0;
    }

    const dirPath = this.buildDirectoryPath(comicTitle, volumeNumber);
    const destDir = path.resolve(this.mangaDataDir, dirPath);

    for (let i = 0; i < imageFiles.length; i++) {
      const ext = path.extname(imageFiles[i]).toLowerCase();
      const newName = `${String(i + 1).padStart(4, "0")}${ext}`;
      await copyFile(
        path.join(sourceDir, imageFiles[i]),
        path.join(destDir, newName)
      );
    }

    return imageFiles.length;
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
