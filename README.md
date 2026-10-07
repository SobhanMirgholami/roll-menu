# Cafe Roll — Digital Menu

A responsive digital menu for Cafe Roll, built with React, Vite and Tailwind CSS. Customers can open the menu from a link or scan a QR code pointing to that link. Authorized administrators can manage products through a separate dashboard.

Product data is stored in Supabase Postgres, product images in Supabase Storage, and administrator sign-in uses Supabase Auth.

**Menu:** [roll-digital-menu.netlify.app](https://roll-digital-menu.netlify.app/)

**Administrator sign-in:** [roll-digital-menu.netlify.app/login](https://roll-digital-menu.netlify.app/login)

## Features

### Customer menu

- Public menu with no customer account required.
- Product names, descriptions, images and prices in Iranian toman.
- Search by product name and filter by category.
- Unavailable products remain visible with an unavailable badge.
- Responsive layouts for mobile and desktop.
- Persian right-to-left layout, English text support and a locally hosted Vazirmatn font.
- Dark coffee-inspired background, frosted glass cards and Cafe Roll branding.
- Animated category selection and product transitions with reduced-motion support.

### Administrator dashboard

- Email and password sign-in, plus sign-out.
- Administrator membership checked against the `admin_users` table.
- Add, edit and delete products.
- Edit the name, description, price, category and image.
- Suggestions from existing categories while entering a category.
- Mark products available or unavailable.
- Required product image when adding a product; keep or replace it when editing.
- Upload validation, image optimization, loading indicators and toast notifications.
- Product deletion confirmation and protection against repeated deletion requests.
- Remove unused images after a successful replacement or deletion.

## Technology

| Package / service | Purpose |
| --- | --- |
| React 19 | Components, state and rendering |
| Vite 8 | Development server and production build |
| Tailwind CSS 4 | Styling, alongside shared CSS and theme styles |
| React Router 7 | Public, login and protected administrator routes |
| Supabase | Database, authentication and image storage |
| Motion | Category and card animations |
| react-hot-toast | Success, error and status notifications |
| react-spinners | Loading indicators |
| Phosphor Icons | Interface icons |
| Vazirmatn | Persian and Latin typography |
| Oxlint | Source linting |
| Netlify | Static hosting and deployment |

Exact dependency versions are recorded in `package-lock.json`.

## Local development

Use Node.js 24 and npm for a development environment matching the build runtime used for this project. You also need a Supabase project configured as described below.

Download or clone this repository, open a terminal in its root directory, then install dependencies:

```bash
npm ci
```

Create `.env.local` beside `package.json`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Get these values from your Supabase project settings. Use the publishable client key. Keep database passwords and Supabase secret/service-role keys out of the frontend and repository.

Vite includes `VITE_*` values in the browser bundle during the build. Restart the development server after editing `.env.local`, and rebuild before publishing configuration changes. See [Vite environment variables](https://vite.dev/guide/env-and-mode).

Start the app:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

### Commands

| Command | Result |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile |
| `npm run dev` | Start the development server |
| `npm run lint` | Run Oxlint |
| `npm run build` | Create production files in `dist/` |
| `npm run preview` | Preview the existing production build locally |

Run `npm run build` before `npm run preview`. The preview server does not rebuild changed source files.

## Supabase setup

The application expects the following tables, permissions and storage bucket. The SQL below is an initial setup for a **new Supabase project**. If your project is already configured, compare its schema and policies rather than rerunning the setup. This README does not contain a migration runner.

### 1. Create the database tables

Run the following in the Supabase SQL Editor:

```sql
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  price bigint not null check (price > 0),
  category text not null check (length(trim(category)) > 0),
  is_available boolean not null default true,
  image_url text not null check (length(trim(image_url)) > 0),
  image_path text,
  created_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
```

`price` is a positive integer in toman. `image_url` is the public image URL; `image_path` is the Storage object path used for cleanup. Categories are stored as text on each product.

### 2. Configure database access

The menu needs public read access. Product mutations require both a valid authenticated user and an administrator membership row. A protected React route controls the UI; database policies enforce access to the actual data. See [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

```sql
alter table public.products enable row level security;
alter table public.admin_users enable row level security;

revoke all on public.products from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admin_users to authenticated;

create policy "Users can read their own admin membership"
on public.admin_users
for select to authenticated
using (user_id = (select auth.uid()));

create policy "Anyone can read menu products"
on public.products
for select to anon, authenticated
using (true);

create policy "Administrators can manage products"
on public.products
for all to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);
```

The app does not grant administrator membership through the browser. Manage membership from the Supabase dashboard or SQL Editor.

### 3. Create the product image bucket

In Supabase Storage, create a bucket with these settings:

| Setting | Value |
| --- | --- |
| Bucket name and ID | `product-images` |
| Public bucket | Enabled |
| Maximum file size | `2097152` bytes (2 MiB) |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp` |

Public access allows customers to display product images. Keep image mutations restricted to administrators. See [Supabase bucket configuration](https://supabase.com/docs/guides/storage/buckets/creating-buckets).

Add the Storage policy in the SQL Editor:

```sql
create policy "Administrators can manage product images"
on storage.objects
for all to authenticated
using (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'product-images'
  and exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);
```

### 4. Add an administrator

1. Enable email/password authentication in Supabase Auth.
2. Create the administrator account in the Authentication dashboard.
3. Ensure that account can sign in under your email confirmation settings.
4. Copy its user UUID and insert it into `admin_users`:

```sql
insert into public.admin_users (user_id)
values ('REPLACE_WITH_AUTH_USER_UUID')
on conflict (user_id) do nothing;
```

Open `/login`, sign in with that account, and manage products at `/admin`.

An authenticated account without an `admin_users` row is denied administrator access. A signed-out visitor opening `/admin` is redirected to `/login`.

## Product and image workflow

The administrator form validates the product fields and accepts JPG, PNG or WebP images up to 2 MiB. The selected image is resized to a maximum dimension of 960 pixels while preserving its aspect ratio, then encoded as WebP at quality `0.8` before upload.

Images receive unique Storage filenames. Creating a product uploads its image and then inserts the database row. Editing can retain the current image or upload a replacement.

After a successful replacement, the service checks whether the previous image path is still referenced before removing it. Deletion follows the same reference check. A cleanup failure produces a notification while retaining the successful product change.

If the database explicitly rejects a save after an image upload, the service attempts to remove the newly uploaded, unused image. If the response is ambiguous, it keeps the image and asks the administrator to refresh and check the result before submitting again. Storage uploads and database writes are separate operations.

The cleanup logic applies to these operations; it does not scan the entire bucket or automatically remove historical orphan files.

## Data flow

1. `App.jsx` fetches products through `productService.js` when the app loads.
2. `MenuPage.jsx` filters the product list by category and search text.
3. `LoginPage.jsx` signs in through Supabase Auth and verifies administrator membership.
4. `ProtectedRoute.jsx` checks access before rendering the administrator dashboard.
5. Administrator actions write to Supabase and update React state after success.
6. An independently opened customer menu reads the latest data when refreshed; there is currently no Realtime subscription.

The active menu uses the cloud database. `productStore.js` is a legacy localStorage helper and is not the current persistence layer. Products previously stored only in a browser are not automatically migrated to Supabase. A new database starts with an empty menu until an administrator adds products.

## Project structure

```text
src/
├── main.jsx
├── index.css                    # Shared styling, glass surfaces and font
├── theme.css                    # Espresso theme and responsive layout
├── assets/
├── components/
│   ├── App.jsx                  # Routes, product state and actions
│   ├── AddProductForm.jsx       # Add/edit form and validation
│   ├── CafeLogo.jsx             # Shared cafe branding
│   ├── CategoryTabs.jsx         # Animated category filtering
│   ├── Loading.jsx              # Loading indicators
│   ├── ProductCard.jsx          # Customer card and administrator controls
│   └── ProtectedRoute.jsx       # Administrator access checks
├── lib/
│   ├── adminAccess.js           # Auth and membership verification
│   ├── optimizeProductImage.js  # Browser image resizing and encoding
│   ├── productMedia.js          # Image fallback and sample-name helpers
│   ├── productService.js        # Cloud reads, writes, uploads and cleanup
│   ├── productStore.js          # Legacy browser storage helper
│   └── supabaseClient.js        # Supabase client configuration
└── pages/
    ├── MenuPage.jsx
    ├── LoginPage.jsx
    └── AdminPage.jsx

public/                          # Fonts, branding and bundled design assets
├── fonts/
├── images/
└── _redirects                   # Netlify SPA routing
index.html                      # Entry document and favicon reference
vite.config.js
package.json
package-lock.json
```

The favicon update adds `public/roll-favicon-v2.svg` and updates the icon link in `index.html`. The shared-logo update adds `src/assets/cafe-roll-logo.webp`. Keep both updates in the repository when publishing their corresponding version.

## Deploy to Netlify

### Manual deployment

1. Confirm `.env.local` contains your public Supabase connection settings.
2. Build the latest source:

   ```bash
   npm run build
   ```

3. Optionally run `npm run preview` and verify the build locally.
4. Open the existing Netlify project's **Deploys** page.
5. Upload the generated `dist` folder using manual deployment.
6. Open the published site and test `/`, `/login` and `/admin`.

Upload the folder containing the built `index.html` and `assets/`. Rebuild after every source or configuration change; uploading an old `dist` publishes the old app.

### Deployment from GitHub

Connect the repository to the Netlify project and configure:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Runtime | Node.js 24 |
| Build environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |

Set these variables in Netlify with the same values used locally. `.env.local` is ignored by Git and will not arrive through a repository deployment. Trigger a new build after changing the values. See [Netlify's Vite deployment guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/).

### Direct route support

Keep this rule in `public/_redirects` so refreshing `/login` or `/admin` serves the React entry document:

```text
/* /index.html 200
```

Vite copies this file into `dist/` during the build.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Only the background appears | Open browser DevTools → Console and Network. Check runtime errors and failed JavaScript requests. Verify a fresh build, connection settings and complete deployment assets. |
| Missing Supabase configuration error | Check the two exact environment variable names, restart local development or rebuild the deployment. |
| “No products found” | Check whether `products` contains rows, the selected category, search text and public read policies. |
| Sign-in succeeds but access is denied | Check that the signed-in user's UUID exists in `admin_users` and that their membership row is readable. |
| Upload fails | Check file type, size, bucket ID, bucket settings, administrator membership and Storage policies. |
| Product writes fail | Check the database schema, authenticated session, grants and administrator policies. |
| Old favicon appears | Confirm the new icon file and HTML link were deployed; reopen the site in a new tab or private window. |
| Refreshing a nested route returns 404 | Confirm `_redirects` exists in the deployed folder. |
| Another browser shows old products | Refresh that menu; the current app does not subscribe to live database updates. |

For an ambiguous save error, refresh and inspect the product list before retrying, to avoid creating a duplicate product.

## Verification before publishing

- A signed-out customer can view, search and filter the menu without seeing administrator controls.
- A signed-out request to `/admin` redirects to `/login`.
- An authenticated non-administrator cannot enter the dashboard or mutate products/images through the APIs.
- An administrator can add a product, edit all fields, replace its image, toggle availability and delete it.
- Saved changes remain after a refresh and are visible from another browser after refreshing its menu.
- Images over 2 MiB or unsupported formats are rejected.
- Replacing an unshared image removes the previous object after the product save succeeds.
- Mobile layouts, keyboard navigation and reduced-motion behavior work as expected.
- Production routes, logo, favicon, fonts and images load successfully.

The repository currently has no automated test script. `npm run lint` and `npm run build` are useful checks, but they do not replace testing the configured Supabase project and published site.

## Branding and assets

Cafe Roll branding is supplied for this cafe. The background and sample product assets are bundled locally. Actual uploaded product images take priority over name-based sample fallbacks.

Keep the bundled Vazirmatn font license with the font assets. Review ownership and usage rights for branding and photos before reusing this project for another business. A repository-wide license has not been specified in the current project files.
