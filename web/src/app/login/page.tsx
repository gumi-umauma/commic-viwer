import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-[22px] font-semibold text-heading mb-6 text-center">
          ログイン
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
