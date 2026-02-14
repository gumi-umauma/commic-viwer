import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetAdminComicsUseCase } from "@/application/usecases/get-admin-comics";

export default async function AdminComicsPage() {
  const getAdminComicsUseCase =
    container.resolve<GetAdminComicsUseCase>("getAdminComicsUseCase");
  const comics = await getAdminComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">漫画管理</h1>
      <div className="mb-4">
        <Link
          href="/admin/comic/register"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          新規登録
        </Link>
      </div>
      <ul className="space-y-2">
        {comics.map((comic) => (
          <li key={comic.id}>
            <Link
              href={`/admin/comic/${comic.id}`}
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
