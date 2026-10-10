# Cypher Store Builder

Multi-tenant no-code e-commerce platform. MSW Cypher Problem 1.

## 🔗 Live Demo
https://cosmic-coders-cypher.vercel.app

## 🎬 Demo Video
[YouTube unlisted link]

## 🔑 Demo Login
- **Email:** owner@demo.com
- **Password:** demo123

## ✨ Features (15 Checkpoints)
1. 5-step onboarding wizard with validation
2. Category selection (14 predefined + custom)
3. One-click dummy product import
4. CSV/Excel upload with template + error report
5. 4 themes with live preview
6. Unique live store URL (/s/[slug])
7. Complete storefront (browse, search, filter, cart, checkout)
8. Admin dashboard with KPIs and low-stock alerts
9. Full content control (logo, banner, colors, fonts, footer)
10. Product & inventory management
11. Order management (5 statuses)
12. Multi-tenant isolation (Firestore + server verification)
13. AI chatbot with 6 read-only tools
14. Chatbot safety (server-side store verification, shows data used)
15. Fully responsive (mobile/tablet/desktop)

## 🛠️ Tech Stack
- **Frontend:** React 19 + Vite + TypeScript + Tailwind + Framer Motion
- **Backend:** Express + Node.js
- **Database:** Firebase Firestore (production)
- **AI:** Google Gemini (server-side tool calling)
- **Deploy:** Vercel

## 🏗️ Architecture
![Architecture](./architecture.png)

## 🚀 Deploy
1. Vercel pe repo connect
2. Env vars add karo (see `.env.example`)
3. Auto-deploy on push

## 🔐 Multi-tenant Security
- Har query storeId se filter hoti hai
- Server-side user verification before chatbot queries
- Chatbot read-only, cross-store access denied
