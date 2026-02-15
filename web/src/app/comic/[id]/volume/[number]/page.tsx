import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetVolumeViewerUseCase } from "@/application/usecases/get-volume-viewer";
import { ComicViewer } from "./comic-viewer";

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
    <ComicViewer
      comicId={viewer.comicId}
      comicTitle={viewer.comicTitle}
      volumeNumber={viewer.volumeNumber}
      pages={viewer.pages}
      nextVolumeNumber={viewer.nextVolumeNumber}
    />
  );
}
