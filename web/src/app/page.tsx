import { container } from "@/infrastructure/container";
import { GetComicsUseCase } from "@/application/usecases/get-comics";

export default async function Home() {
  const getComicsUseCase = container.resolve<GetComicsUseCase>("getComicsUseCase");
  const comics = await getComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">漫画一覧</h1>
      <ul className="space-y-2">
        {comics.map((comic) => (
          <li key={comic.id} className="p-4 border rounded">
            {comic.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
