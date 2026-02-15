import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetAdminComicsUseCase } from "@/application/usecases/get-admin-comics";
import { VolumeRegisterForm } from "./volume-register-form";
import { getSourceFolders } from "./actions";

export default async function AdminVolumeRegisterPage() {
  const getAdminComicsUseCase =
    container.resolve<GetAdminComicsUseCase>("getAdminComicsUseCase");
  const comics = await getAdminComicsUseCase.execute();

  const foldersResult = await getSourceFolders();
  const folders = foldersResult.success ? foldersResult.folders ?? [] : [];

  return (
    <main className="min-h-screen p-8">
      <Link
        href="/admin/comics"
        className="text-primary text-[13px] hover:underline mb-4 inline-block"
      >
        &larr; 漫画管理一覧
      </Link>
      <h1 className="text-[22px] font-semibold text-heading mb-4">巻追加</h1>
      <VolumeRegisterForm comics={comics} folders={folders} />
    </main>
  );
}
