import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetVolumeViewerUseCase } from "@/application/usecases/get-volume-viewer";
import { ImageGrid } from "./image-grid";
import { DeleteVolumeButton } from "./delete-volume-button";

type Props = {
  params: Promise<{ id: string; number: string }>;
};

export default async function AdminVolumeDetailPage({ params }: Props) {
  const { id, number } = await params;
  const volumeNumber = Number(number);

  if (isNaN(volumeNumber)) {
    notFound();
  }

  const getVolumeViewerUseCase =
    container.resolve<GetVolumeViewerUseCase>("getVolumeViewerUseCase");
  const volume = await getVolumeViewerUseCase.execute(id, volumeNumber);

  if (!volume) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <nav className="mb-4">
        <Link
          href={`/admin/comic/${volume.comicId}`}
          className="text-primary text-[13px] hover:underline"
        >
          &larr; {volume.comicTitle}
        </Link>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-heading">
            {volume.comicTitle} - 第{volume.volumeNumber}巻
          </h1>
          <p className="text-secondary text-[11px] mt-1">ページ数: {volume.pages.length}</p>
        </div>
        <DeleteVolumeButton
          comicId={volume.comicId}
          volumeNumber={volume.volumeNumber}
        />
      </div>

      <ImageGrid pages={volume.pages} comicId={volume.comicId} volumeNumber={volume.volumeNumber} />
    </main>
  );
}
