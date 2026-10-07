import { useId } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { SquaresFourIcon } from "@phosphor-icons/react/dist/csr/SquaresFour";
import { CoffeeIcon } from "@phosphor-icons/react/dist/csr/Coffee";
import { OrangeSliceIcon } from "@phosphor-icons/react/dist/csr/OrangeSlice";
import { CakeIcon } from "@phosphor-icons/react/dist/csr/Cake";
function CategoryIcon({ category }) {
  const Icon = category === "همه" ? SquaresFourIcon : /قهوه|گرم/.test(category) ? CoffeeIcon : /دسر/.test(category) ? CakeIcon : OrangeSliceIcon;
  return <Icon size={21} weight="regular" aria-hidden="true" />;
}
export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  return <LayoutGroup id={id}>
    <div className="category-tabs" role="group" aria-label="دسته‌بندی محصولات">
      {categories.map((category) => {
        const active = selectedCategory === category;
        return <button key={category} type="button" aria-pressed={active} onClick={() => onSelectCategory(category)}
          className={`category-tab ${active ? "is-active" : ""}`}>
          {active && <motion.span className="category-indicator" layoutId="active-category"
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}
          <span className="category-label"><CategoryIcon category={category} />{category}</span>
        </button>;
      })}
    </div>
  </LayoutGroup>;
}
