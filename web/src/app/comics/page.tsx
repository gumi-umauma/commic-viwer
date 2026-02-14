import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetComicsUseCase } from "@/application/usecases/get-comics";

export default async function ComicsPage() {
  const getComicsUseCase =
    container.resolve<GetComicsUseCase>("getComicsUseCase");
  const comics = await getComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">漫画一覧</h1>
      <ul className="space-y-2">
        {comics.map((comic) => (
          <li key={comic.id}>
            <Link
              href={`/comic/${comic.id}`}
              className="block p-4 border rounded hover:bg-gray-50 transition-colors"
            >
              {comic.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
