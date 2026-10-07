import { motion, useReducedMotion } from "motion/react";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/csr/PencilSimple";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { englishName } from "../lib/productMedia";
export default function ProductCard({ name, description, price, isAvailable, image, onDelete, onToggleAvailability, onEdit, featured = false, ref }) {
  const isAdmin = Boolean(onDelete || onToggleAvailability || onEdit);
  const reduceMotion = useReducedMotion();
  const badge = <span className={`badge ${isAvailable ? "badge-available" : "badge-unavailable"}`}>{isAvailable ? "موجود" : "ناموجود"}</span>;
  const productPrice = <p className="product-price"><b>{Number(price).toLocaleString("fa-IR")}</b><span>تومان</span></p>;
  if (isAdmin) return <article className="glass admin-product">
    {image && <img src={image} alt={name} loading="lazy" decoding="async" className="admin-product-image" width="96" height="96" />}
    <div className="admin-product-info"><h3 className="product-name">{name}</h3>
      <p className="product-description">{description}</p>{productPrice}<div className="inline-badge">{badge}</div></div>
    <div className="admin-actions">
      {onEdit && <button type="button" className="btn btn-neutral" onClick={onEdit} aria-label={`ویرایش ${name}`}><PencilSimpleIcon size={17} />ویرایش</button>}
      {onToggleAvailability && <button type="button" className="btn btn-neutral" onClick={onToggleAvailability} aria-label={`${isAvailable ? "ناموجود کردن" : "موجود کردن"} ${name}`}>{isAvailable ? "ناموجود کردن" : "موجود کردن"}</button>}
      {onDelete && <button type="button" className="btn btn-danger" onClick={onDelete} aria-label={`حذف ${name}`}><TrashIcon size={17} />حذف</button>}
    </div>
  </article>;
  return <motion.article ref={ref} layout="position" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}
    className={`glass product-card ${featured ? "is-featured" : ""}`}>
    {image && <div className="product-media"><img src={image} alt={name} loading="lazy" decoding="async"
      className="product-image" width="960" height="720" />{!isAvailable && <span className="badge badge-unavailable media-badge">ناموجود</span>}</div>}
    <div className="product-content"><div className="product-copy"><h2 className="product-name">{name}</h2>
      {englishName(name) && <p className="product-english" lang="en" dir="ltr">{englishName(name)}</p>}
      <p className="product-description">{description}</p></div>{productPrice}
      {!image && !isAvailable && <div className="inline-badge">{badge}</div>}</div>
  </motion.article>;
}
