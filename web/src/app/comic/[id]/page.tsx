import Link from "next/link";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/container";
import { GetComicDetailUseCase } from "@/application/usecases/get-comic-detail";
import { getCurrentUserId } from "@/app/lib/session";
import { VolumeCardList } from "./volume-card-list";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ComicDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const getComicDetailUseCase =
    container.resolve<GetComicDetailUseCase>("getComicDetailUseCase");
  const comic = await getComicDetailUseCase.execute(id, userId);

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
      <VolumeCardList comicId={comic.id} volumes={comic.volumes} />
    </main>
  );
}
