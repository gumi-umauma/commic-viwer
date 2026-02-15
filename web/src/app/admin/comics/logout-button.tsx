"use client";

import { useTransition } from "react";
import { logoutAction } from "@/app/login/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-3 py-1 text-[13px] text-muted hover:text-secondary transition-colors disabled:opacity-50"
    >
      ログアウト
    </button>
  );
}
