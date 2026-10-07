export default function CafeLogo() {
  return (
    <div className="logo-frame">
      <img
        src="/cafe-logo.webp"
        alt="لوگوی کافه رول"
        className="logo-image"
        width="400"
        height="400"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  )
}