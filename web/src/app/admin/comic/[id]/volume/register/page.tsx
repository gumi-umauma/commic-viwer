import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { VolumeRegisterForm } from "./volume-register-form";
import { getSourceFolders } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminVolumeRegisterPage({ params }: Props) {
  const { id } = await params;
  const getComicDetailUseCase = container.resolve<GetComicDetailUseCase>(
    "getComicDetailUseCase"
  );
  const comic = await getComicDetailUseCase.execute(id);
  if (!comic) notFound();

  const maxVolumeNumber =
    comic.volumes.length > 0
      ? Math.max(...comic.volumes.map((v) => v.volumeNumber))
      : 0;
  const defaultVolumeNumber = maxVolumeNumber + 1;

  const foldersResult = await getSourceFolders();
  const folders = foldersResult.success ? foldersResult.folders ?? [] : [];

  return (
    <main className="min-h-screen p-8">
      <Link
        href={`/admin/comic/${comic.id}`}
        className="text-primary text-[13px] hover:underline mb-4 inline-block"
      >
        &larr; {comic.title}
      </Link>
      <h1 className="text-[22px] font-semibold text-heading mb-4">巻追加 - {comic.title}</h1>
      <VolumeRegisterForm
        comicId={comic.id}
        defaultVolumeNumber={defaultVolumeNumber}
        folders={folders}
      />
    </main>
  );
}
