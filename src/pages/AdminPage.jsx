import AddProductForm from "../components/AddProductForm";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AdminPage({
  products,
  onAddProduct,
  onDeleteProduct,
  onToggleAvailability,
}) {
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutLoading(true);
    setLogoutError("");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setLogoutError("خروج انجام نشد؛ دوباره امتحان کن.");
        return;
      }

      navigate("/login", { replace: true });
    } catch {
      setLogoutError("ارتباط برقرار نشد؛ دوباره امتحان کن.");
    } finally {
      setLogoutLoading(false);
    }
  }
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <main dir="rtl" className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">مدیریت منو</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="mb-6 rounded-lg bg-stone-700 px-4 py-2 text-white disabled:opacity-50"
        >
          {logoutLoading ? "در حال خروج..." : "خروج از حساب"}
        </button>

        {logoutError && (
          <p role="alert" className="mb-4 text-red-700">
            {logoutError}
          </p>
        )}

        <AddProductForm categories={categories} onAddProduct={onAddProduct} />

        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isAvailable={product.isAvailable}
              image={product.image}
              onDelete={() => onDeleteProduct(product.id)}
              onToggleAvailability={() => onToggleAvailability(product.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
