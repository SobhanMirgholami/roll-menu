import { lazy, Suspense, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import MenuPage from "../pages/MenuPage";
import Loading from "./Loading";
import { loadProducts, saveProducts } from "../lib/productStore";
const AdminPage = lazy(() => import("../pages/AdminPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

export default function App() {
  const [products, setProducts] = useState(loadProducts);
  const currentProducts = useRef(products);
  function commit(nextProducts, message) {
    try {
      saveProducts(nextProducts);
      currentProducts.current = nextProducts;
      setProducts(nextProducts);
      toast.success(message);
    } catch (error) {
      toast.error("ذخیره نشد؛ فضای ذخیره‌سازی مرورگر را بررسی کنید.");
      throw error;
    }
  }
  function handleAddProduct(product) {
    commit([...currentProducts.current, product], "محصول اضافه شد.");
  }
  function handleUpdateProduct(updatedProduct) {
    if (!currentProducts.current.some((p) => p.id === updatedProduct.id)) throw new Error("محصول حذف شده است.");
    commit(currentProducts.current.map((p) => p.id === updatedProduct.id
      ? { ...p, ...updatedProduct, isAvailable: p.isAvailable } : p), "تغییرات ذخیره شد.");
  }
  function handleDeleteProduct(id) {
    if (!window.confirm("این محصول حذف شود؟")) return false;
    commit(currentProducts.current.filter((p) => p.id !== id), "محصول حذف شد.");
    return true;
  }
  function handleToggleAvailability(id) {
    commit(currentProducts.current.map((p) => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p), "وضعیت محصول تغییر کرد.");
  }
  return <MotionConfig reducedMotion="user"><BrowserRouter>
    <Toaster position="top-center" toastOptions={{ duration: 3500, style: { direction: "rtl", fontFamily: "Vazirmatn, sans-serif", color: "#f7eeee", background: "#28252d", border: "1px solid #655b64" } }} />
    <Suspense fallback={<Loading />}><Routes>
      <Route path="/" element={<MenuPage products={products} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage products={products} onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onToggleAvailability={handleToggleAvailability} /></ProtectedRoute>} />
    </Routes></Suspense>
  </BrowserRouter></MotionConfig>;
}
