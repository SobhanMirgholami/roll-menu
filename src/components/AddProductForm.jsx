import { useState } from 'react'

export default function AddProductForm({ onAddProduct }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const numericPrice = Number(price)

    if (!name.trim() || !category.trim()) {
      setError('نام محصول و دسته‌بندی را وارد کن.')
      return
    }

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      setError('قیمت باید یک عدد بزرگ‌تر از صفر باشد.')
      return
    }

    const newProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: category.trim(),
      isAvailable: true,
    }

    onAddProduct(newProduct)

    setName('')
    setDescription('')
    setPrice('')
    setCategory('')
    setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 grid gap-4 rounded-2xl bg-white p-5"
    >
      <h2 className="text-xl font-bold text-stone-900">
        افزودن محصول
      </h2>

      <label>
        نام محصول
        <input
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 p-2"
        />
      </label>

      <label>
        توضیحات
        <textarea
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 p-2"
        />
      </label>

      <label>
        قیمت به تومان
        <input
          required
          type="number"
          min="1"
          step="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 p-2"
        />
      </label>

      <label>
        دسته‌بندی
        <input
          required
          type="text"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-300 p-2"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="rounded-lg bg-amber-700 px-4 py-3 text-white"
      >
        افزودن محصول
      </button>
    </form>
  )
}