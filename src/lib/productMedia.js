const samples = {
  "لاته": ["latte", "Latte"], "اسپرسو": ["espresso", "Espresso"],
  "کاپوچینو": ["cappuccino", "Cappuccino"], "لیموناد": ["lemonade", "Lemonade"], "چیزکیک": ["cheesecake", "Cheesecake"],
};
export function productImage(product) {
  return product.image || (samples[product.name] ? `/images/${samples[product.name][0]}.webp` : "");
}
export function englishName(name) { return samples[name]?.[1] ?? ""; }
