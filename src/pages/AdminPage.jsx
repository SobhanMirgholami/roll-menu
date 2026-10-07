import AddProductForm from "../components/AddProductForm";
import ProductCard from "../components/ProductCard";

export default function AdminPage({
  products,
  onAddProduct,
  onDeleteProduct,
  onToggleAvailability,
}) {
  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <main dir="rtl" className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">مدیریت منو</h1>

        <AddProductForm categories={categories} onAddProduct={onAddProduct} />

        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isAvailable={product.isAvailable}
              onDelete={() => onDeleteProduct(product.id)}
              onToggleAvailability={() => onToggleAvailability(product.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
