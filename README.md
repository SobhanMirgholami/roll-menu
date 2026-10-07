# Cafe Roll — Dark Design 2

A complete React + Vite + Tailwind project based on your supplied ZIP.

## Run locally
1. Copy your existing `.env.local` into this project, or fill `.env.example` and rename it `.env.local`.
2. Run `npm install`.
3. Run `npm run dev`.

## Publish
Run `npm run build` and upload the resulting `dist` folder to your existing Netlify site. The archive also includes a built `dist` using your existing public Supabase configuration. The SPA redirect is included.

## Files to learn from
- `src/index.css`: shared dark styles, glass cards, local font and responsive layouts.
- `src/theme.css`: the layout and colors for design 2 (espresso).
- `src/components/CategoryTabs.jsx`: Motion shared category indicator.
- `src/components/ProductCard.jsx`: animated customer cards and admin actions.
- `src/components/Loading.jsx`: React Spinners loader.
- `src/components/App.jsx`: lazy routes, verified local persistence and toast notifications.
- `src/lib/productStore.js`: existing `cafe-products` localStorage key.
- `src/lib/optimizeProductImage.js`: image resize/encoding, preserving aspect ratio.

## Packages
Motion, react-hot-toast, react-spinners, Phosphor Icons and Vazirmatn. Font is self-hosted with its OFL license. Reduced motion preferences are respected. Image uploads remain required, limited to JPG/PNG/WebP and 2 MiB. All generated images are bundled locally as WebP. Built-in sample images appear for the five sample product names only when no image is saved; customer-uploaded photos take priority.

## Existing data
Saved products are preserved on the same domain. Products/photos still live in the browser's localStorage, not a shared cloud database. Initial visits do not rewrite all stored images. Save failures keep the form open and show an error instead of a success toast. Admin authentication still uses your existing Supabase account.

## Design assets
Background and five sample product images were generated individually with the built-in image tool, matching the selected dark café concepts. Your existing Cafe Roll logo is preserved. Photos may be replaced through the admin editor.
