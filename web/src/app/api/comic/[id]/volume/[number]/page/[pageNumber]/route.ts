import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { container } from "@/infrastructure/container";
import { PgComicRepository } from "@/infrastructure/repositories/pg-comic-repository";
import { PgVolumeRepository } from "@/infrastructure/repositories/pg-volume-repository";
import { PageFileScanner } from "@/infrastructure/filesystem/page-file-scanner";
import { ComicId } from "@/domain/value-objects/comic-id";
import { VolumeNumber } from "@/domain/value-objects/volume-number";

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };
  return types[ext] || "application/octet-stream";
}

type RouteParams = {
  params: Promise<{ id: string; number: string; pageNumber: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const { id, number, pageNumber: pageNumberStr } = await params;

  const volumeNumber = parseInt(number, 10);
  const pageNumber = parseInt(pageNumberStr, 10);

  if (
    isNaN(volumeNumber) ||
    volumeNumber < 1 ||
    isNaN(pageNumber) ||
    pageNumber < 1
  ) {
    return NextResponse.json(
      {
        type: "bad-request",
        title: "Bad Request",
        status: 400,
        detail: "パラメータが不正です",
      },
      { status: 400 }
    );
  }

  const comicRepository =
    container.resolve<PgComicRepository>("comicRepository");
  const volumeRepository =
    container.resolve<PgVolumeRepository>("volumeRepository");
  const pageFileScanner =
    container.resolve<PageFileScanner>("pageFileScanner");

  const cid = ComicId.create(id);

  const comic = await comicRepository.findById(cid);
  if (!comic) {
    return NextResponse.json(
      {
        type: "not-found",
        title: "Not Found",
        status: 404,
        detail: "漫画が見つかりません",
      },
      { status: 404 }
    );
  }

  const volume = await volumeRepository.findByComicIdAndNumber(
    cid,
    VolumeNumber.create(volumeNumber)
  );

  if (!volume) {
    return NextResponse.json(
      {
        type: "not-found",
        title: "Not Found",
        status: 404,
        detail: "巻が見つかりません",
      },
      { status: 404 }
    );
  }

  const directoryPath = pageFileScanner.buildDirectoryPath(
    comic.title,
    volume.volumeNumber.value
  );
  const filenames = await pageFileScanner.scanPages(directoryPath);
  const pageIndex = pageNumber - 1;

  if (pageIndex >= filenames.length) {
    return NextResponse.json(
      {
        type: "not-found",
        title: "Not Found",
        status: 404,
        detail: "ページが見つかりません",
      },
      { status: 404 }
    );
  }

  const absolutePath = pageFileScanner.getAbsolutePath(
    directoryPath,
    filenames[pageIndex]
  );

  if (!existsSync(absolutePath)) {
    return NextResponse.json(
      {
        type: "not-found",
        title: "Not Found",
        status: 404,
        detail: "画像ファイルが見つかりません",
      },
      { status: 404 }
    );
  }

  const fileBuffer = await readFile(absolutePath);
  const contentType = getContentType(absolutePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
