import { useState } from 'react'
import CafeLogo from '../components/CafeLogo'
import ProductCard from '../components/ProductCard'
import CategoryTabs from '../components/CategoryTabs'

export default function MenuPage({ products }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('همه')

  const categories = [
    'همه',
    ...new Set(products.map((product) => product.category)),
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'همه' ||
      product.category === selectedCategory

    const matchesSearch = product.name.includes(searchTerm.trim())

    return matchesCategory && matchesSearch
  })

  return (
    <main dir="rtl" className="page">
      <div className="container">
        <header className="menu-header">
          <CafeLogo />

          <h1 className="menu-title">
            منوی کافه رول
          </h1>
        </header>

        <label className="field search-field">
          <span className="sr-only">
            جستجوی محصول
          </span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="جستجوی محصول"
            className="input search-input"
          />
        </label>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isAvailable={product.isAvailable}
              image={product.image}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p role="status" className="glass empty">
            محصولی پیدا نشد.
          </p>
        )}
      </div>
    </main>
  )
}