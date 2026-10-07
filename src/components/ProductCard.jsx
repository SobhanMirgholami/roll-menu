export default function ProductCard({
  name,
  description,
  price,
  isAvailable,
  image,
  onDelete,
  onToggleAvailability,
  onEdit,
}) {
  const isAdmin = Boolean(
    onDelete || onToggleAvailability || onEdit
  );

  const availabilityBadge = (
    <span
      className={`badge ${
        isAvailable
          ? "badge-available"
          : "badge-unavailable"
      }`}
    >
      {isAvailable ? "موجود" : "ناموجود"}
    </span>
  );

  if (isAdmin) {
    return (
      <article className="glass admin-product">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="admin-product-image"
          />
        )}

        <div className="admin-product-info">
          <h3 className="product-name">{name}</h3>

          <p className="product-description">
            {description}
          </p>

          <p className="product-price">
            {price.toLocaleString("fa-IR")} تومان
          </p>

          <div className="inline-badge">
            {availabilityBadge}
          </div>
        </div>

        <div className="admin-actions">
          {onEdit && (
            <button
              type="button"
              className="btn btn-neutral"
              onClick={onEdit}
              aria-label={`ویرایش ${name}`}
            >
              ویرایش
            </button>
          )}

          {onToggleAvailability && (
            <button
              type="button"
              className="btn btn-neutral"
              onClick={onToggleAvailability}
              aria-label={`${
                isAvailable
                  ? "ناموجود کردن"
                  : "موجود کردن"
              } ${name}`}
            >
              {isAvailable
                ? "ناموجود کردن"
                : "موجود کردن"}
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onDelete}
              aria-label={`حذف ${name}`}
            >
              حذف
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="glass product-card">
      {image && (
        <div className="product-media">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="product-image"
          />

          {!isAvailable && (
            <span className="badge badge-unavailable media-badge">
              ناموجود
            </span>
          )}
        </div>
      )}

      <div className="product-content">
        <h2 className="product-name">{name}</h2>

        <p className="product-description">
          {description}
        </p>

        <p className="product-price">
          {price.toLocaleString("fa-IR")} تومان
        </p>

        {!image && !isAvailable && (
          <div className="inline-badge">
            {availabilityBadge}
          </div>
        )}
      </div>
    </article>
  );
}