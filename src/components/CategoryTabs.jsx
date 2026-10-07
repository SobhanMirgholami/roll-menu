export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelectCategory(category)}
          aria-pressed={selectedCategory === category}
          className={`rounded-full px-4 py-2 ${
            selectedCategory === category
              ? 'bg-amber-700 text-white'
              : 'bg-white text-stone-700'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}