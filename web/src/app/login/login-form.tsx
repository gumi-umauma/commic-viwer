"use client";

import { useState, useTransition } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      setError("IDとパスワードを入力してください");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await loginAction(loginId.trim(), password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="w-full px-4 py-2 text-[14px] bg-primary text-on-primary rounded hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        ログイン
      </button>
      {error && <p className="text-danger text-sm">{error}</p>}
    </form>
  );
}
