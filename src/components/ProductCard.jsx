export default function ProductCard({
  name,
  description,
  price,
  isAvailable,
}) {
  return (
    <article
      className={`rounded-2xl border border-stone-200 p-5 ${
        isAvailable ? 'bg-white' : 'bg-stone-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-stone-900">
          {name}
        </h2>

        {!isAvailable && (
          <span className="rounded-full bg-stone-700 px-3 py-1 text-xs text-white">
            ناموجود
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-stone-500">
        {description}
      </p>

      <p className="mt-4 font-semibold text-amber-700">
        {price.toLocaleString('fa-IR')} تومان
      </p>
    </article>
  )
}