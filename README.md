# Cypher Store Builder

**Cypher Store Builder** is a modern, multi-tenant no-code e-commerce store platform. Small business owners can sign up, complete an intuitive 5-step onboarding wizard, and immediately launch a fully functional, live online store with an isolated URL (`/s/[slug]`), persistent inventory, cart & checkout, order fulfillment tracking, and an embedded AI Store Assistant.

---

## ⚡ Tech Stack

- **Frontend & App Architecture**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Modern SaaS Design System (Linear / Vercel aesthetic)
- **Animations & 3D**: Motion (Framer Motion v12) + Interactive CSS 3D Tilt (`rotateX` / `rotateY` / `perspective: 900px`) + Canvas Confetti
- **Full-Stack & APIs**: Express + Node.js (`tsx`)
- **AI Assistant**: Google Gemini API (`gemini-3.8-flash` via `@google/genai`) with server-side proxy and tool execution
- **Catalog Import**: SheetJS (`xlsx`) for parsing `.csv`, `.xlsx`, and `.xls` files with instant validation and error diagnostics
- **Notifications**: Sonner rich toast notifications
- **Data & Multi-Tenant Storage**: Isolated multi-tenant repository with membership authorization

---

## 🔑 Demo Login

- **Email**: `owner@demo.com`
- **Password**: `demo123`
*(A 1-click Demo Login button is also directly available on the Sign In page)*

---

## 🚀 15 Checkpoint Capabilities

1. **5-Step Onboarding Wizard**:
   - **Step 1: Store Information** — Store name, URL slug with real-time preview, business type dropdown, email, phone, physical address, and logo URL with instant validation.
   - **Step 2: Category Selection** — 14 predefined retail categories (*T-Shirts, Jeans, Shoes, Watches, Headphones, Mobiles, Laptops, Snacks, Beverages, Skincare, Home Decor, Books, Sports Gear, Toys*) plus custom category creator.
   - **Step 3: Product Import** — Two paths:
     - ⚡ *Import Dummy Products*: 1-click realistic INR product generator tailored to chosen categories.
     - 📄 *Upload CSV/Excel*: SheetJS file parser, column mapping, table preview, row-level error reporting, and downloadable CSV template.
   - **Step 4: Theme Selection & Live Preview** — 4 distinct themes (*Minimal, Bold, Elegant, Fresh*) with interactive mock storefront preview updating colors, typography (Inter, system-ui, Georgia, Courier), and card styles in real-time.
   - **Step 5: Review & Confetti Launch** — Final store review and celebration launch animation using `canvas-confetti`, creating the isolated store and routing directly to the Admin Panel.

2. **Unique Live URL**:
   - Each tenant receives their own public live storefront at `/s/[slug]`.

3. **Live Public Storefront (`/s/[slug]`)**:
   - Hero banner with store branding and color themes.
   - Instant live search bar filtering across name, SKU, and descriptions.
   - Category filter pills / segmented selector.
   - 2-column (mobile) to 4-column (desktop) responsive product grid.
   - **3D Tilt on Hover** with 900px perspective, `rotateY`/`rotateX` tracking, and scale micro-interactions.
   - "Only X left" inventory badge (when stock < 10) and "Out of stock" indicator with disabled buy states.
   - Dynamic store primary color styling on CTA buttons.
   - Shopping bag icon with live badge counter in header.
   - Store details and footer copyright.

4. **Cart Page (`/s/[slug]/cart`)**:
   - Itemized cart listing with product imagery, unit price, and subtotal.
   - Interactive quantity steppers (+ / -) clamped to available stock.
   - Item removal with instant toast feedback.
   - Order summary card with subtotal, free shipping threshold, and total amount.
   - Empty cart state with "Browse Products" action.

5. **Checkout Page (`/s/[slug]/checkout`)**:
   - Customer information form: Full Name, Email, Phone, and Detailed Shipping Address.
   - Payment method selection: Cash on Delivery (COD) and Instant UPI / QR on delivery.
   - Order summary sidebar with product breakdown.
   - Order placement handler that reduces inventory stock and creates an isolated order record.
   - Cart storage isolated in `localStorage` under `cart_[slug]`.
   - Dedicated order success screen: "🎉 Order placed!" with generated order number (`#ORD-XXXXX`).

6. **Admin Panel (`/admin/[slug]`)**:
   - **Responsive Navigation**: Collapsible sidebar on desktop with quick "View Live Store" link and mobile drawer menu.
   - **Authorization Guard**: Verifies authenticated user membership for the tenant store.
   - **Dashboard**:
     - 4 metric stat cards: Total Revenue (₹), Total Orders, Active Catalog Items, and Low Stock Alerts.
     - Recent orders list with customer name, order number, items, total, and status badge.
     - Low stock alerts list with one-click "Restock +30" quick action.
   - **Products Management**:
     - Searchable product table with image, category, price, and stock levels.
     - "+ Add product" modal and edit product modal (name, category, price, compare price, stock, SKU, image, description).
     - Product deletion with confirmation and Sonner toast notifications.
   - **Orders Lifecycle Management**:
     - Detailed order cards with items, quantities, addresses, and customer contact.
     - 5 interactive status buttons: `PLACED`, `PACKED`, `SHIPPED`, `DELIVERED`, and `CANCELLED`.
   - **Content & Branding**:
     - General store details form (Name, Business Type, Logo, Banner, Email, Phone, Address, Footer Text).
     - HTML color picker + HEX inputs for Primary and Accent brand colors.
     - Typography font family selector (Inter, system-ui, Georgia, Courier).
     - Save button that instantly updates the store and live storefront.

7. **AI Store Assistant (Floating Widget on Admin Pages)**:
   - Floating action button (💬) in bottom-right corner.
   - Framer Motion scale, opacity, and translate entry/exit animations.
   - AI tools (all read-only, filtered strictly by `storeId`):
     - `getTopProducts(days, limit)`
     - `getLowStock(threshold)`
     - `getRevenueComparison()` (This week vs last week)
     - `getOrderStats()` (Fulfillment breakdown)
     - `getRecentOrders(limit)`
     - `getTotalProducts()`
   - Strict system prompt guardrails: answers exclusively using store tool data, returns `"I don't have that data."` when queries fall outside store bounds, and never invents metrics.
   - Quick suggestion chips for common retail metrics.
   - "Assistant is thinking..." loading animation.

8. **Auth & Multi-Store Dashboard**:
   - `/signup`: User registration with validation, auto sign-in, and redirect to onboarding wizard.
   - `/login`: Email + password authentication with 1-click demo login button.
   - `/dashboard`: Overview of all stores owned by the user with product count, order count, total revenue, direct management buttons, and "+ New store" creation.

9. **Multi-Tenant Isolation**:
   - Queries and storage entries strictly isolate data by `storeId`.
   - Memberships track user ownership and staff roles.
   - Public storefronts only render data belonging to the specific slug.

10. **Responsive Design**:
    - Tested across mobile (360px+), tablet (768px), and desktop (1280px+).
    - Touch targets ≥ 44px, zero horizontal layout breakage, and fluid container widths.

---

## 🛠️ Local Development & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

### Environment Variables (`.env`):
- `GEMINI_API_KEY`: Google Gemini API key (optional, used for AI Chatbot; fallback tool engine automatically active if omitted).
- `PORT`: Dev server port (default: `3000`).
