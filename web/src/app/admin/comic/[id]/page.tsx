import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { ComicTitleEditor } from "./comic-title-editor";
import { DeleteComicButton } from "./delete-comic-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminComicDetailPage({ params }: Props) {
  const { id } = await params;
  const getComicDetailUseCase =
    container.resolve<GetComicDetailUseCase>("getComicDetailUseCase");
  const comic = await getComicDetailUseCase.execute(id);

  if (!comic) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <nav className="mb-4">
        <Link href="/admin/comics" className="text-blue-600 hover:underline">
          &larr; 漫画管理一覧
        </Link>
      </nav>
      <ComicTitleEditor comicId={comic.id} initialTitle={comic.title} />
      <div className="mb-4">
        <Link
          href={`/admin/comic/${comic.id}/volume/register`}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block"
        >
          巻を追加
        </Link>
      </div>
      {comic.volumes.length > 0 ? (
        <ul className="space-y-2">
          {comic.volumes.map((volume) => (
            <li
              key={volume.id}
              className="block p-4 border rounded"
            >
              第{volume.volumeNumber}巻
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">巻が登録されていません</p>
      )}
      <div className="mt-8 pt-4 border-t">
        <DeleteComicButton comicId={comic.id} />
      </div>
    </main>
  );
}
