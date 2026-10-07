export default function ProductCard({
  name,
  description,
  price,
  isAvailable,
  image,
  onDelete,
  onToggleAvailability,
}) {
  return (
    <article
      className={`rounded-2xl border border-stone-200 p-5 ${
        isAvailable ? "bg-white" : "bg-stone-200"
      }`}
    >
      {image && (
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-stone-900">{name}</h2>

        {!isAvailable && (
          <span className="rounded-full bg-stone-700 px-3 py-1 text-xs text-white">
            ناموجود
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-stone-500">{description}</p>

      <p className="mt-4 font-semibold text-amber-700">
        {price.toLocaleString("fa-IR")} تومان
      </p>

      {(onDelete || onToggleAvailability) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700"
            >
              حذف محصول
            </button>
          )}

          {onToggleAvailability && (
            <button
              type="button"
              onClick={onToggleAvailability}
              className="rounded-lg bg-stone-700 px-3 py-2 text-sm text-white"
            >
              {isAvailable ? "ناموجود کردن" : "موجود کردن"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
