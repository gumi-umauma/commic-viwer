"use client";

import { useTransition } from "react";
import { deleteUser } from "./actions";
import { UserDto } from "@/application/usecases/get-users";

export function UserTable({ users }: { users: UserDto[] }) {
  if (users.length === 0) {
    return <p className="text-secondary text-sm">登録ユーザーはいません</p>;
  }

  const canDelete = users.length > 1;

  return (
    <table className="w-full max-w-md border-collapse">
      <thead>
        <tr className="border-b border-outline text-left text-sm text-secondary">
          <th className="py-2 pr-4">ログインID</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} canDelete={canDelete} />
        ))}
      </tbody>
    </table>
  );
}

function UserRow({ user, canDelete }: { user: UserDto; canDelete: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!window.confirm(`ユーザー「${user.loginId}」を削除しますか？`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result && !result.success) {
        alert(result.error ?? "削除に失敗しました");
      }
    });
  };

  return (
    <tr className="border-b border-outline">
      <td className="py-2 pr-4">{user.loginId}</td>
      <td className="py-2 text-right">
        <button
          onClick={handleDelete}
          disabled={isPending || !canDelete}
          title={canDelete ? undefined : "ユーザーが1人のため削除できません"}
          className="px-3 py-1 text-[13px] border border-danger text-danger rounded hover:bg-danger hover:text-danger-fg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-danger"
        >
          {isPending ? "削除中..." : "削除"}
        </button>
      </td>
    </tr>
  );
}
