import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { MotionConfig } from "motion/react";
import toast, { Toaster } from "react-hot-toast";

import MenuPage from "../pages/MenuPage";
import Loading from "./Loading";
import {
  getProducts,
  createProduct,
  setProductAvailability,
  updateProduct,
  deleteProduct,
} from "../lib/productService";

const AdminPage = lazy(() => import("../pages/AdminPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const deletingProducts = useRef(new Set());
  async function handleAddProduct(product) {
    try {
      const savedProduct = await createProduct(product);

      setProducts((previous) => [...previous, savedProduct]);

      toast.success("محصول اضافه شد.");
    } catch (err) {
      toast.error(err?.message || "ذخیره محصول انجام نشد.");

      throw err;
    }
  }
  async function handleUpdateProduct(product) {
    try {
      const result = await updateProduct(product);
      const savedProduct = result.product;

      setProducts((previous) =>
        previous.map((item) =>
          item.id === savedProduct.id ? savedProduct : item,
        ),
      );

      if (result.imageCleanupFailed) {
        toast("تغییرات ذخیره شد، اما پاک‌کردن عکس قبلی انجام نشد.", {
          duration: 6000,
        });
      } else {
        toast.success("تغییرات محصول ذخیره شد.");
      }
    } catch (err) {
      toast.error(err?.message || "ویرایش محصول انجام نشد.");

      throw err;
    }
  }
  async function handleToggleAvailability(id) {
    const product = products.find((item) => item.id === id);

    if (!product) {
      return;
    }

    try {
      const updatedProduct = await setProductAvailability(
        id,
        !product.isAvailable,
      );

      setProducts((previous) =>
        previous.map((item) => (item.id === id ? updatedProduct : item)),
      );

      toast.success("وضعیت محصول تغییر کرد.");
    } catch (err) {
      toast.error(err?.message || "تغییر وضعیت محصول انجام نشد.");
    }
  }


  async function handleDeleteProduct(id) {
    if (deletingProducts.current.has(id)) {
      return false;
    }

    const product = products.find((item) => item.id === id);

    if (!product) {
      return false;
    }

    if (!window.confirm(`محصول «${product.name}» حذف شود؟`)) {
      return false;
    }

    deletingProducts.current.add(id);
    const toastId = toast.loading("در حال حذف محصول...");

    try {
      const result = await deleteProduct(id);

      setProducts((previous) =>
        previous.filter((item) => item.id !== result.id)
      );

      if (result.imageCleanupFailed) {
        toast("محصول حذف شد، اما پاک‌کردن عکس انجام نشد.", {
          id: toastId,
          duration: 6000,
        });
      } else {
        toast.success("محصول حذف شد.", { id: toastId });
      }

      return true;
    } catch (err) {
      toast.error(err?.message || "حذف محصول انجام نشد.", {
        id: toastId,
      });

      return false;
    } finally {
      deletingProducts.current.delete(id);
    }
  }

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      try {
        const receivedProducts = await getProducts();

        if (active) {
          setProducts(receivedProducts);
        }
      } catch (err) {
        if (active) {
          setError(
            "دریافت محصولات انجام نشد: " +
              (err?.message || "ارتباط را بررسی کن."),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, [retryCount]);

  function handleRetry() {
    setError("");
    setLoading(true);
    setRetryCount((previous) => previous + 1);
  }

  function showProductsPage(page) {
    if (loading) {
      return <Loading label="در حال دریافت منو..." />;
    }

    if (error) {
      return (
        <main dir="rtl" className="page">
          <div className="container">
            <p role="alert" className="error">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="btn btn-primary"
            >
              تلاش دوباره
            </button>
          </div>
        </main>
      );
    }

    return page;
  }

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              direction: "rtl",
              fontFamily: "Vazirmatn, sans-serif",
              color: "#f7eeee",
              background: "#28252d",
              border: "1px solid #655b64",
            },
          }}
        />

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={showProductsPage(<MenuPage products={products} />)}
            />

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  {showProductsPage(
                    <AdminPage
                      products={products}
                      onAddProduct={handleAddProduct}
                      onUpdateProduct={handleUpdateProduct}
                      onDeleteProduct={handleDeleteProduct}
                      onToggleAvailability={handleToggleAvailability}
                    />,
                  )}
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  );
}
