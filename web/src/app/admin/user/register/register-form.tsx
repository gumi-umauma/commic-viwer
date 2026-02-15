"use client";

import { useState, useTransition } from "react";
import { registerUser } from "./actions";

export function RegisterForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = loginId.trim();
    if (!trimmedId || !password) {
      setError("IDとパスワードを入力してください");
      return;
    }
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await registerUser(trimmedId, password);
      if (result.success) {
        setSuccess(`ユーザー「${trimmedId}」を登録しました`);
        setLoginId("");
        setPassword("");
      } else {
        setError(result.error ?? "登録に失敗しました");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div>
        <label htmlFor="loginId" className="block text-sm text-secondary mb-1">
          ログインID
        </label>
        <input
          id="loginId"
          type="text"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          className="w-full bg-surface border border-outline rounded px-3 py-2 focus:border-outline-focus focus:outline-none"
          disabled={isPending}
          autoFocus
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm text-secondary mb-1"
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-surface border border-outline rounded px-3 py-2 focus:border-outline-focus focus:outline-none"
          disabled={isPending}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        登録
      </button>
      {error && <p className="text-danger text-sm">{error}</p>}
      {success && <p className="text-primary text-sm">{success}</p>}
    </form>
  );
}
