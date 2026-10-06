export default function ProductCard({ name, description, price }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <h2 className="text-xl font-bold text-stone-900">
        {name}
      </h2>

      <p className="mt-2 text-sm text-stone-500">
        {description}
      </p>

      <p className="mt-4 font-semibold text-amber-700">
        {price.toLocaleString('fa-IR')} تومان
      </p>
    </article>
  )
}