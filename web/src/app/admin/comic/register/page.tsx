import Link from "next/link";
import { RegisterForm } from "./register-form";
import { getUnregisteredFolders } from "./actions";

export default async function AdminComicRegisterPage() {
  const foldersResult = await getUnregisteredFolders();
  const folders = foldersResult.success ? foldersResult.folders ?? [] : [];

  return (
    <main className="min-h-screen p-8">
      <Link
        href="/admin/comics"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        &larr; 漫画管理一覧
      </Link>
      <h1 className="text-2xl font-bold mb-4">漫画新規登録</h1>
      <RegisterForm folders={folders} />
    </main>
  );
}
