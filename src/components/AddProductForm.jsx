import { useRef, useState } from 'react'

function normalizeCategory(value) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
}

export default function AddProductForm({
  onAddProduct,
  categories = [],
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    setImage('')
    setError('')

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('عکس باید JPG، PNG یا WebP باشد.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('حجم عکس باید حداکثر ۲ مگابایت باشد.')
      event.target.value = ''
      return
    }

    setImageLoading(true)

    const reader = new FileReader()

    reader.onload = () => {
      setImage(reader.result)
      setImageLoading(false)
    }

    reader.onerror = () => {
      setError('خواندن عکس انجام نشد؛ دوباره انتخاب کن.')
      setImageLoading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    reader.readAsDataURL(file)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (imageLoading || submitting) {
      return
    }

    setError('')

    if (!image) {
      setError('انتخاب عکس محصول الزامی است.')
      return
    }

    if (!name.trim() || !category.trim()) {
      setError('نام محصول و دسته‌بندی را وارد کن.')
      return
    }

    const numericPrice = Number(price)

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      !Number.isInteger(numericPrice) ||
      numericPrice <= 0
    ) {
      setError('قیمت باید یک عدد صحیح بزرگ‌تر از صفر باشد.')
      return
    }

    const normalizedCategory = normalizeCategory(category)

    const existingCategory = categories.find(
      (item) => normalizeCategory(item) === normalizedCategory
    )

    const newProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: existingCategory ?? normalizedCategory,
      isAvailable: true,
      image,
    }

    setSubmitting(true)

    try {
      await onAddProduct(newProduct)

      setName('')
      setDescription('')
      setPrice('')
      setCategory('')
      setImage('')
      setError('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch {
      setError('افزودن محصول انجام نشد؛ دوباره امتحان کن.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass add-product-form"
    >
      <h2 className="section-title">
        افزودن محصول
      </h2>

      <label className="field">
        <span>نام محصول *</span>

        <input
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="نام محصول را وارد کنید"
          className="input"
          disabled={submitting}
        />
      </label>

      <label className="field">
        <span>توضیحات</span>

        <textarea
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="توضیحات محصول را وارد کنید"
          className="input"
          disabled={submitting}
        />
      </label>

      <label className="field">
        <span>قیمت به تومان *</span>

        <input
          required
          type="number"
          min="1"
          step="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="مثلاً 120000"
          className="input"
          disabled={submitting}
        />
      </label>

      <label className="field">
        <span>دسته‌بندی *</span>

        <input
          required
          type="text"
          list="product-category-options"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="انتخاب دسته‌ی قبلی یا نوشتن دسته‌ی جدید"
          className="input"
          disabled={submitting}
        />

        <datalist id="product-category-options">
          {categories.map((existingCategory) => (
            <option
              key={existingCategory}
              value={existingCategory}
            />
          ))}
        </datalist>
      </label>

      <label className="field upload-box">
        <span>عکس محصول *</span>

        <input
          required
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={imageLoading || submitting}
          onChange={handleImageChange}
          className="file-input"
        />

        <small className="hint">
          JPG، PNG یا WebP — حداکثر ۲ مگابایت
        </small>
      </label>

      {imageLoading && (
        <p role="status" className="hint">
          در حال خواندن عکس...
        </p>
      )}

      {image && (
        <img
          src={image}
          alt="پیش‌نمایش عکس محصول"
          className="image-preview"
        />
      )}

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={imageLoading || submitting}
        className="btn btn-primary"
      >
        {imageLoading
          ? 'در حال خواندن عکس...'
          : submitting
            ? 'در حال افزودن...'
            : 'افزودن محصول'}
      </button>
    </form>
  )
}