import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabaseClient";
import CafeLogo from "../components/CafeLogo";
import AddProductForm from "../components/AddProductForm";
import ProductCard from "../components/ProductCard";

export default function AdminPage({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleAvailability,
}) {
  const navigate = useNavigate();

  const [editingProduct, setEditingProduct] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  function handleEdit(product) {
    setEditingProduct(product);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSaveEdit(updatedProduct) {
    await onUpdateProduct(updatedProduct);
    setEditingProduct(null);
  }

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

  return (
    <main dir="rtl" className="page">
      <div className="container">
        <header className="admin-header">
          <div className="admin-brand">
            <CafeLogo />

            <h1 className="admin-title">
              مدیریت منوی کافه رول
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="btn btn-outline"
          >
            {logoutLoading
              ? "در حال خروج..."
              : "خروج از حساب"}
          </button>
        </header>

        {logoutError && (
          <p role="alert" className="error mb-5">
            {logoutError}
          </p>
        )}

        <div className="admin-layout">
          <AddProductForm
            key={editingProduct?.id ?? "add"}
            categories={categories}
            productToEdit={editingProduct}
            onAddProduct={onAddProduct}
            onUpdateProduct={handleSaveEdit}
            onCancelEdit={() => setEditingProduct(null)}
          />

          <section
            className="glass admin-products"
            aria-labelledby="admin-products-title"
          >
            <h2
              id="admin-products-title"
              className="section-title"
            >
              محصولات منو
            </h2>

            <div className="admin-product-list">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  isAvailable={product.isAvailable}
                  image={product.image}
                  onEdit={() => handleEdit(product)}
                  onDelete={() =>
                    onDeleteProduct(product.id)
                  }
                  onToggleAvailability={() =>
                    onToggleAvailability(product.id)
                  }
                />
              ))}
            </div>

            {products.length === 0 && (
              <p className="empty">
                هنوز محصولی اضافه نشده است.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}