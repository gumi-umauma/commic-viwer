import Link from "next/link";
import { container } from "@/infrastructure/container";
import { GetUsersUseCase } from "@/application/usecases/get-users";
import { UserTable } from "./user-table";
import { RegisterForm } from "./register-form";

export default async function AdminUserPage() {
  const getUsersUseCase =
    container.resolve<GetUsersUseCase>("getUsersUseCase");
  const users = await getUsersUseCase.execute();

  return (
    <main className="min-h-screen p-8">
      <Link
        href="/admin/comics"
        className="text-primary text-[13px] hover:underline mb-4 inline-block"
      >
        &larr; 漫画管理一覧
      </Link>
      <h1 className="text-[22px] font-semibold text-heading mb-6">
        ユーザー管理
      </h1>

      <section className="mb-8">
        <h2 className="text-[18px] font-semibold text-heading mb-4">
          登録ユーザー
        </h2>
        <UserTable users={users} />
      </section>

      <section>
        <h2 className="text-[18px] font-semibold text-heading mb-4">
          ユーザー登録
        </h2>
        <RegisterForm />
      </section>
    </main>
  );
}
