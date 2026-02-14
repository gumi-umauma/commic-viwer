import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetVolumeViewerUseCase } from "@/application/usecases/get-volume-viewer";

type Props = {
  params: Promise<{ id: string; number: string }>;
};

export default async function ViewerPage({ params }: Props) {
  const { id, number } = await params;
  const volumeNumber = parseInt(number, 10);

  if (isNaN(volumeNumber) || volumeNumber < 1) {
    notFound();
  }

  const getVolumeViewerUseCase =
    container.resolve<GetVolumeViewerUseCase>("getVolumeViewerUseCase");
  const viewer = await getVolumeViewerUseCase.execute(id, volumeNumber);

  if (!viewer) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b p-4 flex items-center gap-4">
        <Link
          href={`/comic/${viewer.comicId}`}
          className="text-blue-600 hover:underline"
        >
          &larr; 巻一覧
        </Link>
        <h1 className="text-lg font-bold">
          {viewer.comicTitle} - 第{viewer.volumeNumber}巻
        </h1>
      </header>
      {viewer.pages.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          ページが見つかりません
        </div>
      ) : (
        <div className="flex flex-col items-center bg-gray-100">
          {viewer.pages.map((page) => (
            <img
              key={page.pageNumber}
              src={page.imageUrl}
              alt={`第${viewer.volumeNumber}巻 ページ${page.pageNumber}`}
              className="w-full max-w-3xl"
              style={{ aspectRatio: "2/3" }}
              loading="lazy"
            />
          ))}
        </div>
      )}
    </main>
  );
}
