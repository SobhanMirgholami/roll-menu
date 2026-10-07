import { ClipLoader } from "react-spinners";
export default function Loading({ label = "در حال بارگذاری...", inline = false }) {
  return <span role="status" className={inline ? "loading-inline" : "loading-screen"} dir="rtl">
    <ClipLoader size={inline ? 18 : 30} color="currentColor" aria-hidden="true" /><span>{label}</span>
  </span>;
}
