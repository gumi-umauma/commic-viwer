import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ComicDetailPage({ params }: Props) {
  const { id } = await params;
  const getComicDetailUseCase =
    container.resolve<GetComicDetailUseCase>("getComicDetailUseCase");
  const comic = await getComicDetailUseCase.execute(id);

  if (!comic || comic.volumes.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <nav className="mb-4">
        <Link href="/comics" className="text-primary text-[13px] hover:underline">
          &larr; 漫画一覧
        </Link>
      </nav>
      <h1 className="text-[22px] font-semibold text-heading mb-4">{comic.title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {comic.volumes.map((volume) => (
          <Link
            key={volume.id}
            href={`/comic/${comic.id}/volume/${volume.volumeNumber}`}
            className="bg-surface border border-outline rounded overflow-hidden hover:bg-surface-hover transition-colors"
          >
            <img
              src={`/api/comic/${comic.id}/volume/${volume.volumeNumber}/page/1`}
              alt={`第${volume.volumeNumber}巻`}
              className="w-full aspect-[2/3] object-cover bg-placeholder"
            />
            <p className="p-2 text-body text-sm font-medium">
              第{volume.volumeNumber}巻
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
