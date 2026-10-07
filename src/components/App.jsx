import ProductCard from "./ProductCard";
import CategoryTabs from "./CategoryTabs";
import { useState } from "react";
const products = [
  {
    id: 1,
    name: "لاته",
    description: "اسپرسو همراه با شیر",
    price: 120000,
    category: "قهوه گرم",
  },
  {
    id: 2,
    name: "اسپرسو",
    description: "یک شات قهوه",
    price: 80000,
    category: "قهوه گرم",
  },
  {
    id: 3,
    name: "کاپوچینو",
    description: "اسپرسو، شیر و فوم شیر",
    price: 110000,
    category: "قهوه گرم",
  },
  {
    id: 5,
    name: "لیموناد",
    description: "لیمو تازه همراه با یخ",
    price: 90000,
    category: "نوشیدنی سرد",
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

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  const categories = [
    "همه",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "همه" || product.category === selectedCategory;

    const matchesSearch = product.name.includes(searchTerm.trim());

    return matchesCategory && matchesSearch;
  });
  return (
    <main dir="rtl" className="min-h-screen bg-stone-100 px-4 py-10">
      <label className="mb-6 block">
        <span className="mb-2 block font-medium text-stone-700">
          جستجوی محصول
        </span>

        <input
          type="search"
          placeholder="مثلاً لاته"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </label>
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <p className="mt-6 text-center text-stone-500">محصولی پیدا نشد.</p>
      )}
    </main>
  );
}
