import { useState } from 'react'
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
    <main dir="rtl" className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">
          منوی کافه
        </h1>

        <label className="mb-6 block">
          <span className="mb-2 block">جستجوی محصول</span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="مثلاً لاته"
            className="w-full rounded-xl border border-stone-300 bg-white p-3"
          />
        </label>

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isAvailable={product.isAvailable}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="mt-6 text-center">
            محصولی پیدا نشد.
          </p>
        )}
      </div>
    </main>
  )
}