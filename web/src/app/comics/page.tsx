import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetComicsUseCase } from "@/application/usecases/get-comics";

export default async function ComicsPage() {
  const getComicsUseCase =
    container.resolve<GetComicsUseCase>("getComicsUseCase");
  const comics = await getComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-[22px] font-semibold text-heading mb-4">漫画一覧</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {comics.map((comic) => (
          <Link
            key={comic.id}
            href={`/comic/${comic.id}`}
            className="bg-surface border border-outline rounded overflow-hidden hover:bg-surface-hover transition-colors"
          >
            <img
              src={`/api/comic/${comic.id}/volume/1/page/1`}
              alt={comic.title}
              className="w-full aspect-[2/3] object-cover bg-placeholder"
            />
            <p className="p-2 text-body text-sm font-medium truncate">
              {comic.title}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
