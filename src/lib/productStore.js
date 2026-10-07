export const initialProducts = [
  { id: 1, name: "لاته", description: "اسپرسو همراه با شیر", price: 120000, category: "قهوه گرم", isAvailable: true },
  { id: 2, name: "اسپرسو", description: "یک شات قهوه", price: 80000, category: "قهوه گرم", isAvailable: true },
  { id: 3, name: "کاپوچینو", description: "اسپرسو، شیر و فوم شیر", price: 110000, category: "قهوه گرم", isAvailable: true },
  { id: 5, name: "لیموناد", description: "لیمو تازه همراه با یخ", price: 90000, category: "نوشیدنی سرد", isAvailable: false },
  { id: 6, name: "چیزکیک", description: "چیزکیک با سس توت‌فرنگی", price: 150000, category: "دسر", isAvailable: true },
];
export function loadProducts() {
  try {
    const saved = localStorage.getItem("cafe-products");
    if (saved === null) return initialProducts;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialProducts;
  } catch { return initialProducts; }
}
export function saveProducts(products) {
  localStorage.setItem("cafe-products", JSON.stringify(products));
}
