import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError("ورود انجام نشد؛ ایمیل و رمز را بررسی کن.");
        return;
      }

      navigate("/admin", { replace: true });
    } catch {
      setError("ارتباط برقرار نشد؛ دوباره امتحان کن.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-stone-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-md gap-4 rounded-2xl bg-white p-6"
      >
        <h1 className="text-2xl font-bold">ورود مدیر</h1>

        <label>
          ایمیل
          <input
            required
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <label>
          رمز عبور
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-700 p-3 text-white disabled:opacity-50"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </main>
  );
}
