import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MenuPage from "../pages/MenuPage";
const AdminPage = lazy(() => import("../pages/AdminPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

const initialProducts = [
  {
    id: 1,
    name: "لاته",
    description: "اسپرسو همراه با شیر",
    price: 120000,
    category: "قهوه گرم",
    isAvailable: true,
  },
  {
    id: 2,
    name: "اسپرسو",
    description: "یک شات قهوه",
    price: 80000,
    category: "قهوه گرم",
    isAvailable: true,
  },
  {
    id: 3,
    name: "کاپوچینو",
    description: "اسپرسو، شیر و فوم شیر",
    price: 110000,
    category: "قهوه گرم",
    isAvailable: true,
  },
  {
    id: 5,
    name: "لیموناد",
    description: "لیمو تازه همراه با یخ",
    price: 90000,
    category: "نوشیدنی سرد",
    isAvailable: false,
  },
  {
    id: 6,
    name: "چیزکیک",
    description: "چیزکیک با سس توت‌فرنگی",
    price: 150000,
    category: "دسر",
    isAvailable: true,
  },
];

function loadProducts() {
  try {
    const savedProducts = localStorage.getItem("cafe-products");

    if (savedProducts === null) {
      return initialProducts;
    }

    const parsedProducts = JSON.parse(savedProducts);

    return Array.isArray(parsedProducts)
      ? parsedProducts
      : initialProducts;
  } catch {
    return initialProducts;
  }
}

export default function App() {
  const [products, setProducts] = useState(loadProducts);

  const lastSavedProducts = useRef(products);

  useEffect(() => {
    // Avoid rewriting all saved images on the initial menu visit.
    if (lastSavedProducts.current === products) return;
    lastSavedProducts.current = products;
    try {
      localStorage.setItem(
        "cafe-products",
        JSON.stringify(products)
      );
    } catch (error) {
      console.error("ذخیره‌سازی محصولات انجام نشد:", error);
    }
  }, [products]);

  function handleAddProduct(newProduct) {
    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  }

  function handleUpdateProduct(updatedProduct) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === updatedProduct.id
          ? updatedProduct
          : product
      )
    );
  }

  function handleDeleteProduct(productId) {
    const confirmed = window.confirm("این محصول حذف شود؟");

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId
      )
    );
  }

  function handleToggleAvailability(productId) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              isAvailable: !product.isAvailable,
            }
          : product
      )
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<p dir="rtl" role="status" className="empty">در حال بارگذاری...</p>}>
      <Routes>
        <Route
          path="/"
          element={<MenuPage products={products} />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onToggleAvailability={
                  handleToggleAvailability
                }
              />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}