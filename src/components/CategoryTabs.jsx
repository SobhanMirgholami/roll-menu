export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div
      className="category-tabs"
      role="group"
      aria-label="دسته‌بندی محصولات"
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
          className={`category-tab ${
            selectedCategory === category ? 'is-active' : ''
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}