import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import { optimizeProductImage } from "../lib/optimizeProductImage";

function normalizeCategory(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");
}

export default function AddProductForm({
  onAddProduct,
  onUpdateProduct,
  onCancelEdit,
  productToEdit = null,
  categories = [],
}) {
  const isEditing = productToEdit !== null;

  const [name, setName] = useState(
    productToEdit?.name ?? ""
  );

  const [description, setDescription] = useState(
    productToEdit?.description ?? ""
  );

  const [price, setPrice] = useState(
    String(productToEdit?.price ?? "")
  );

  const [category, setCategory] = useState(
    productToEdit?.category ?? ""
  );

  const [image, setImage] = useState(
    productToEdit?.image ?? ""
  );

  const [imageLoading, setImageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const imageRequestRef = useRef(0);
  useEffect(() => () => { imageRequestRef.current += 1; }, []);

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

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

    const request = ++imageRequestRef.current;
    try {
      const optimizedImage = await optimizeProductImage(file);
      if (request === imageRequestRef.current) setImage(optimizedImage);
    } catch {
      if (request === imageRequestRef.current) {
        setError("خواندن عکس انجام نشد؛ دوباره انتخاب کن.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      if (request === imageRequestRef.current) setImageLoading(false);
    }
  }

  function resetForm() {
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (imageLoading || submitting) {
      return;
    }

    setError("");

    if (!name.trim() || !category.trim()) {
      setError("نام محصول و دسته‌بندی را وارد کن.");
      return;
    }

    if (!image) {
      setError("انتخاب عکس محصول الزامی است.");
      return;
    }

    const numericPrice = Number(price);

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      !Number.isInteger(numericPrice) ||
      numericPrice <= 0
    ) {
      setError(
        "قیمت باید یک عدد صحیح بزرگ‌تر از صفر باشد."
      );
      return;
    }

    const normalizedCategory = normalizeCategory(category);

    const existingCategory = categories.find(
      (item) =>
        normalizeCategory(item) === normalizedCategory
    );

    const product = {
      ...productToEdit,
      id: isEditing
        ? productToEdit.id
        : crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      category: existingCategory ?? normalizedCategory,
      image,
    };

    setSubmitting(true);

    try {
      if (isEditing) {
        await onUpdateProduct(product);
      } else {
        await onAddProduct({
          ...product,
          isAvailable: true,
        });

        resetForm();
      }
    } catch {
      setError(
        "ذخیره محصول انجام نشد؛ دوباره امتحان کن."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass add-product-form"
    >
      <h2 className="section-title">
        {isEditing ? "ویرایش محصول" : "افزودن محصول"}
      </h2>

      <label className="field">
        <span>نام محصول *</span>

        <input
          required
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
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
          onChange={(event) =>
            setDescription(event.target.value)
          }
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
          onChange={(event) =>
            setPrice(event.target.value)
          }
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
          onChange={(event) =>
            setCategory(event.target.value)
          }
          placeholder="انتخاب دسته قبلی یا نوشتن دسته جدید"
          className="input"
          disabled={submitting}
        />

        <datalist id="product-category-options">
          {categories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>

      <label className="field upload-box">
        <span>
          {isEditing
            ? "تغییر عکس محصول"
            : "عکس محصول *"}
        </span>

        <input
          ref={fileInputRef}
          required={!image}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={imageLoading || submitting}
          onChange={handleImageChange}
          className="file-input"
        />

        <small className="hint">
          JPG، PNG یا WebP — حداکثر ۲ مگابایت
        </small>

        {isEditing && image && (
          <small className="hint">
            اگر عکس جدید انتخاب نکنی، عکس فعلی حفظ می‌شود.
          </small>
        )}
      </label>

      {imageLoading && (
        <Loading inline label="در حال آماده‌سازی عکس..." />
      )}

      {image && (
        <img
          src={image}
          alt="پیش‌نمایش عکس محصول"
          className="image-preview"
          decoding="async"
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
          ? <Loading inline label="در حال آماده‌سازی عکس..." />
          : submitting
            ? <Loading inline label="در حال ذخیره..." />
            : isEditing
              ? "ذخیره تغییرات"
              : "افزودن محصول"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={onCancelEdit}
          disabled={imageLoading || submitting}
          className="btn btn-outline"
        >
          انصراف از ویرایش
        </button>
      )}
    </form>
  );
}