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
        <Link href="/comics" className="text-blue-600 hover:underline">
          &larr; 漫画一覧
        </Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">{comic.title}</h1>
      <ul className="space-y-2">
        {comic.volumes.map((volume) => (
          <li key={volume.id}>
            <Link
              href={`/comic/${comic.id}/volume/${volume.volumeNumber}`}
              className="block p-4 border rounded hover:bg-gray-50 transition-colors"
            >
              第{volume.volumeNumber}巻
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
