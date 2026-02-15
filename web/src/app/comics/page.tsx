import { container } from "@/infrastructure/container";
import { GetComicsUseCase } from "@/application/usecases/get-comics";
import { ComicsList } from "./comics-list";

export default async function ComicsPage() {
  const getComicsUseCase =
    container.resolve<GetComicsUseCase>("getComicsUseCase");
  const comics = await getComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-[22px] font-semibold text-heading mb-4">漫画一覧</h1>
      <ComicsList comics={comics} />
    </main>
  );
}
