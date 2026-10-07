import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Loading from "./Loading";
import CafeLogo from "./CafeLogo";
import { supabase } from "../lib/supabaseClient";
import { getAdminAccess } from "../lib/adminAccess";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let requestId = 0;
    let currentUserId = null;
    let timer;

    async function checkAccess() {
      const request = ++requestId;
      setStatus("checking");

      try {
        const result = await getAdminAccess();

        if (active && request === requestId) {
          currentUserId = result.userId;
          setStatus(result.status);
        }
      } catch {
        if (active && request === requestId) {
          setStatus("error");
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        requestId += 1;
        currentUserId = null;
        clearTimeout(timer);
        setStatus("signedOut");
      } else if (
        event === "SIGNED_IN" &&
        session?.user?.id !== currentUserId
      ) {
        requestId += 1;
        setStatus("checking");
        clearTimeout(timer);
        // بررسی دسترسی خارج از callback احراز هویت اجرا می‌شود.
        timer = setTimeout(() => {
          void checkAccess();
        }, 0);
      }
    });

    void checkAccess();

    return () => {
      active = false;
      requestId += 1;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [retryCount]);

  if (status === "checking") {
    return <Loading label="در حال بررسی دسترسی..." />;
  }

  if (status === "signedOut") {
    return <Navigate to="/login" replace />;
  }

  if (status === "allowed") {
    return children;
  }

  return (
    <main dir="rtl" className="page login-page">
      <section className="glass login-form">
        <CafeLogo />

        <h1 className="login-title">
          {status === "error"
            ? "بررسی دسترسی انجام نشد"
            : "دسترسی به مدیریت ندارید"}
        </h1>

        <p role="alert" className="error">
          {status === "error"
            ? "ارتباط را بررسی کنید و دوباره تلاش کنید."
            : "این حساب اجازهٔ مدیریت منو را ندارد."}
        </p>

        {status === "error" && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setStatus("checking");
              setRetryCount((previous) => previous + 1);
            }}
          >
            تلاش دوباره
          </button>
        )}

        <Link to="/login" className="btn btn-outline">
          ورود با حساب دیگر
        </Link>

        <Link to="/" className="login-back">
          بازگشت به منو
        </Link>
      </section>
    </main>
  );
}
