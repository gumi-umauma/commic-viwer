import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function AdminUserRegisterPage() {
  return (
    <main className="min-h-screen p-8">
      <Link
        href="/admin/comics"
        className="text-primary text-[13px] hover:underline mb-4 inline-block"
      >
        &larr; 漫画管理一覧
      </Link>
      <h1 className="text-[22px] font-semibold text-heading mb-4">
        ユーザー登録
      </h1>
      <RegisterForm />
    </main>
  );
}
