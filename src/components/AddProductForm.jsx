import { useRef, useState } from "react";

function normalizeCategory(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");
}

export default function AddProductForm({ onAddProduct, categories = [] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    setImage("");
    setError("");

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("عکس باید JPG، PNG یا WebP باشد.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("حجم عکس باید حداکثر ۲ مگابایت باشد.");
      event.target.value = "";
      return;
    }

    setImageLoading(true);

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageLoading(false);
    };

    reader.onerror = () => {
      setError("خواندن عکس انجام نشد؛ دوباره انتخاب کن.");
      setImageLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (imageLoading) {
      setError("صبر کن تا خواندن عکس کامل شود.");
      return;
    }

    if (!image) {
      setError("انتخاب عکس محصول الزامی است.");
      return;
    }

    const numericPrice = Number(price);

    if (!name.trim() || !category.trim()) {
      setError("نام محصول و دسته‌بندی را وارد کن.");
      return;
    }

    if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("قیمت باید یک عدد بزرگ‌تر از صفر باشد.");
      return;
    }

    const normalizedCategory = normalizeCategory(category);

    const existingCategory = categories.find(
      (item) => normalizeCategory(item) === normalizedCategory,
    );

    const newProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: existingCategory ?? normalizedCategory,
      isAvailable: true,
      image,
    };

    onAddProduct(newProduct);

    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setImage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 grid gap-4 rounded-2xl bg-white p-5"
    >
      <h2 className="text-xl font-bold text-stone-900">افزودن محصول</h2>

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
          list="product-category-options"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="انتخاب دسته‌ی قبلی یا نوشتن دسته‌ی جدید"
          className="mt-1 w-full rounded-lg border border-stone-300 p-2"
        />
        <datalist id="product-category-options">
          {categories.map((existingCategory) => (
            <option key={existingCategory} value={existingCategory} />
          ))}
        </datalist>
      </label>

      <label>
        عکس محصول — الزامی
        <input
          required
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={imageLoading}
          onChange={handleImageChange}
          className="mt-2 block w-full"
        />
        <span className="mt-1 block text-sm text-stone-500">
          JPG، PNG یا WebP — حداکثر ۲ مگابایت
        </span>
      </label>

      {imageLoading && (
        <p role="status" className="text-sm text-stone-500">
          در حال خواندن عکس...
        </p>
      )}

      {image && (
        <img
          src={image}
          alt="پیش‌نمایش عکس محصول"
          className="h-40 w-full rounded-xl object-cover"
        />
      )}

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={imageLoading}
        className="rounded-lg bg-amber-700 px-4 py-3 text-white disabled:opacity-50"
      >
        {imageLoading ? "در حال خواندن عکس..." : "افزودن محصول"}
      </button>
    </form>
  );
}
