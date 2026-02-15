import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetAdminComicsUseCase } from "@/application/usecases/get-admin-comics";
import { AdminComicsList } from "./admin-comics-list";
import { LogoutButton } from "./logout-button";

export default async function AdminComicsPage() {
  const getAdminComicsUseCase =
    container.resolve<GetAdminComicsUseCase>("getAdminComicsUseCase");
  const comics = await getAdminComicsUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[22px] font-semibold text-heading">漫画管理</h1>
        <LogoutButton />
      </div>
      <div className="mb-4 flex gap-2">
        <Link
          href="/admin/comic/register"
          className="inline-block px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors"
        >
          漫画を追加
        </Link>
        <Link
          href="/admin/volume/register"
          className="inline-block px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors"
        >
          巻を追加
        </Link>
        <Link
          href="/admin/user"
          className="inline-block px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors"
        >
          ユーザー管理
        </Link>
      </div>
      <AdminComicsList comics={comics} />
    </main>
  );
}
