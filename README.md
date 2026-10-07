# ☕ Roll Menu

A digital café menu built with React and Tailwind CSS, featuring an admin panel and authentication through Supabase.

Customers can browse, search, and filter the menu without signing in.

## Live Demo

- [Customer Menu](https://strong-cactus-d24fb7.netlify.app/)
- [Admin Login](https://strong-cactus-d24fb7.netlify.app/login)
- [Admin Panel](https://strong-cactus-d24fb7.netlify.app/admin)

The deployed demo may not include the latest source changes.

## Features

### Customer Menu

- Product names, descriptions, prices, and images
- Search by product name
- Category filtering
- Unavailable product indicators
- Persian interface with right-to-left layout
- Responsive layout for mobile and desktop

### Admin Panel

- Email and password authentication
- Sign out
- Protected admin route
- Add and delete products
- Toggle product availability
- Existing category suggestions
- Category normalization for whitespace and Persian characters
- Required product image with preview
- JPG, PNG, and WebP support with a maximum file size of 2 MB

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Supabase Auth
- LocalStorage
- Netlify for demo hosting

## Getting Started

Install Node.js and npm before running the project.

Clone the repository and install dependencies:

```bash
git clone <REPOSITORY_URL>
cd roll-menu
npm install
```

Replace `<REPOSITORY_URL>` with your repository URL.

Create a `.env.local` file in the project root, next to `package.json`:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Use your Supabase project URL and Publishable key. Never include a Secret or service_role key in frontend code.

Start the development server:

```bash
npm run dev
```

The terminal will display the local URL.

## Admin Authentication Setup

1. Create a Supabase project.
2. Enable email and password authentication.
3. Create an admin account under Authentication → Users and confirm its email.
4. Keep public sign-ups disabled.
5. Add your connection settings to `.env.local`.

The current route guard checks whether a user is authenticated. It does not check a separate admin role, so existing authentication accounts should belong only to administrators.

## Project Structure

```text
src/
├── components/
│   ├── App.jsx
│   ├── AddProductForm.jsx
│   ├── CategoryTabs.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── MenuPage.jsx
│   ├── AdminPage.jsx
│   └── LoginPage.jsx
├── lib/
│   └── supabaseClient.js
├── assets/
├── index.css
└── main.jsx
```

| Component        | Responsibility                                             |
| ---------------- | ---------------------------------------------------------- |
| `App`            | Product state, local persistence, and routing              |
| `MenuPage`       | Public menu, search, and category filtering                |
| `AdminPage`      | Product management controls                                |
| `LoginPage`      | Admin sign-in                                              |
| `ProtectedRoute` | Authentication check before displaying the admin panel     |
| `AddProductForm` | Product details, category suggestions, and image selection |
| `ProductCard`    | Product display and optional management controls           |
| `CategoryTabs`   | Category selection                                         |
| `supabaseClient` | Supabase client initialization                             |

## Routes

| Route    | Description                          |
| -------- | ------------------------------------ |
| `/`      | Public customer menu                 |
| `/login` | Admin login                          |
| `/admin` | Admin panel; requires authentication |

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Build the production version in dist
npm run preview  # Preview the production build locally
npm run lint     # Run code checks
```

## Netlify Deployment

Build the project:

```bash
npm run build
```

Deploy the generated `dist` directory.

For direct navigation to `/login` and `/admin`, create `public/_redirects` with:

```text
/* /index.html 200
```

Vite copies this file into `dist` during the build.

For deployment from a Git repository, configure these build environment variables in Netlify:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

## Current Limitations

- Products and images are stored in the current browser's LocalStorage.
- Admin changes are not shared across devices or browsers.
- Clearing site data removes locally saved products.
- Large images can exceed the LocalStorage quota and prevent persistence.
- Images are required for new products; initial products may not have images.
- Admin roles and database-level write permissions are not implemented yet.
- This is a demonstration version; shared storage for a production menu is still pending.

## Planned Improvements

- Store products in the Supabase database
- Upload images to Supabase Storage
- Restrict database writes to authorized administrators
- Edit existing products
- Generate a QR code for the public menu URL
