import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import CafeLogo from "../components/CafeLogo";
import ProductCard from "../components/ProductCard";
import CategoryTabs from "../components/CategoryTabs";
import { productImage } from "../lib/productMedia";
export default function MenuPage({ products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const deferredSearch = useDeferredValue(searchTerm.trim());
  const categories = useMemo(() => ["همه", ...new Set(products.map((p) => p.category))], [products]);
  const filteredProducts = useMemo(() => products.filter((product) =>
    (selectedCategory === "همه" || product.category === selectedCategory) && product.name.includes(deferredSearch)
  ), [products, selectedCategory, deferredSearch]);
  return <main dir="rtl" className="page menu-page"><div className="container">
    <header className="menu-header"><CafeLogo />
      <div className="menu-heading"><p className="eyebrow" lang="en" dir="ltr">CAFE ROLL / MENU</p>
        <h1 className="menu-title">منوی <span>کافه رول</span></h1></div>
      <label className="search-field"><span className="sr-only">جستجوی محصول</span>
        <input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجوی نام نوشیدنی یا دسر..." className="input search-input" />
        <MagnifyingGlassIcon className="search-icon" size={24} aria-hidden="true" /></label>
    </header>
    <div className="menu-layout"><CategoryTabs categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="product-grid" aria-busy={searchTerm.trim() !== deferredSearch}><AnimatePresence mode="popLayout">
        {filteredProducts.map((product, index) => <ProductCard key={product.id} name={product.name}
          description={product.description} price={product.price} isAvailable={product.isAvailable}
          image={productImage(product)} featured={index === 0} />)}
      </AnimatePresence></div>
      {filteredProducts.length === 0 && <p role="status" className="glass empty">محصولی پیدا نشد.</p>}
    </div>
  </div></main>;
}
