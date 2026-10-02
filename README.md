# KapadaSETU (कपड़ासेतु) 🧵♻️

> **"Connecting Waste to Worth, Building a Cleaner Tomorrow"**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**KapadaSETU** is a digital circular-economy marketplace designed to bridge the gap between textile waste generators (**sellers**: tailors, boutiques, garment factories, housing societies) and textile recycling ventures (**buyers**). By streamlining discovery, negotiation, trust verification, and logistics into a single workflow, KapadaSETU turns cloth waste into valuable sustainable products.

---

## 🌟 Key Features

- **Role-Based Portals:** Seamless onboarding tailored for both Waste Sellers and Recycling Buyers with custom dashboard views.
- **Interactive Waste Discovery Map:** Dynamic, location-aware map (powered by Leaflet) to discover nearby cloth waste listings and buyers visually.
- **Deal Negotiation & Offers System:** Full deal lifecycle management — post listings, send counter-offers, accept/reject bids, and track status transitions in real time.
- **Integrated Transport Logistics:** Arrange and track waste pickup logistics directly after deal confirmation.
- **Razorpay-Style Payment Sandbox:** Built-in simulated payment Gateway UI for end-to-end user testing without external API credentials.
- **Admin & Platform Governance:** Complete overview panel to handle user KYC verifications, deal disputes, and platform analytics.
- **Interactive Recycling Journey:** Visual educational lifecycle module mapping the journey from textile scrap to recycled consumer products.
- **Bilingual Support (i18n):** Native toggleable support for **English** and **Hindi (हिंदी)**.
- **Cinematic Experience:** Modern design complete with customized canvas animations, loaders, and responsive UI components.

---

## 🚀 Live Demo & Offline Mode

This project is built as a **zero-dependency, plug-and-play front-end application**. It ships with rich, realistic mock data stored directly in-memory/localStorage — allowing full interactive testing out of the box **without configuring a backend, database, or API keys**.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **Mapping:** Leaflet + React-Leaflet
- **Backend Schema (Optional):** Supabase / PostgreSQL migrations

---

## 💻 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/kapada-setu.git](https://github.com/your-username/kapada-setu.git)
   cd kapada-setu

 * Install dependencies:
   npm install

 * Start the development server:
   npm run dev

 * Open your browser and navigate to http://localhost:3000.
🏗️ Production Build & Verification
To verify type safety and generate optimized static assets for deployment:
# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview

📂 Project Structure
kapada-setu/
├── src/
│   ├── App.tsx                    # Main router and global application state
│   ├── db.ts                      # In-memory mock database & persistence CRUD helpers
│   ├── types.ts                   # Centralized TypeScript types, interfaces, and enums
│   ├── i18n.tsx                   # English / Hindi translation dictionaries & provider
│   ├── vite-env.d.ts              # Global environment type definitions
│   └── components/                # Modular UI Components
│       ├── Onboarding.tsx          # Role selection & business setup
│       ├── SellerDashboard.tsx     # Listing management & offer tracking
│       ├── BuyerDashboard.tsx      # Marketplace discovery & filtering
│       ├── ListingDetail.tsx       # Listing page with offer submit workflow
│       ├── DealDetail.tsx          # Real-time deal status & negotiation room
│       ├── AdminDashboard.tsx      # KYC verification & platform dispute handling
│       ├── MapComponent.tsx        # Leaflet interactive map integration
│       ├── RazorpayModal.tsx       # Sandbox checkout interface
│       ├── RecyclingJourney.tsx    # Textile recycling lifecycle visualizer
│       ├── CinematicBackground.tsx # Canvas background particle animations
│       └── WeaveLoader.tsx         # Custom textile-themed UI loaders
└── supabase/
    └── migrations/                # Ready-to-use PostgreSQL schema for future Supabase backend

🗄️ Backend Integration (Optional)
While the app functions standalone via client-side storage, a ready-to-deploy Supabase / PostgreSQL schema is provided under the supabase/migrations/ directory. You can execute these migrations on your database instance if you wish to wire up real authentication, database triggers, and storage buckets.
🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request for new features, bug fixes, or Hindi translation enhancements.
 * Fork the Project
 * Create your Feature Branch (git checkout -b feature/AmazingFeature)
 * Commit your Changes (git commit -m 'Add some AmazingFeature')
 * Push to the Branch (git push origin featureHere is a polished, professional README.md` formatted specifically for GitHub repositories. It enhances structural clarity, adds visual hierarchy, and includes badge placeholders for an impressive open-source presentation.
# KapadaSETU (कपड़ासेतु)

> **"Connecting Waste to Worth, Building a Cleaner Tomorrow"**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**KapadaSETU** is a digital marketplace that bridges the gap between cloth-waste **sellers** (tailors, boutiques, garment factories, residential societies) and **recyclers/buyers** who upcycle textile waste into high-value products. It streamlines discovery, trust verification, and transport logistics in a unified digital workflow.

This repository is a fully functional, self-contained front-end application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. It features realistic seed data persisted via local storage, allowing instant execution without external API dependencies, database configurations, or keys.

---

## Key Features

- 👤 **Role-Based Onboarding**: Seamless registration tailored for both Sellers and Buyers with personalized business profile setups.
- 🧵 **Seller Workspace**: Post textile waste listings (fabric type, weight/quantity, high-res photos, target price) and manage inbound offers.
- 🔍 **Buyer Marketplace**: Browse and filter regional listings by cloth category, condition, and proximity, with direct offer capabilities.
- 🗺️ **Interactive Geographic Mapping**: Integrated **Leaflet** map to visualize nearby supply and demand clusters geographically.
- 🤝 **Deal Management & Negotiation**: Detailed pages to review offers, counter-negotiate, accept/reject proposals, and monitor deal lifecycles.
- 🚚 **Integrated Logistics**: Built-in transport scheduling and pickup arrangements upon deal completion.
- 💳 **Sandbox Payment Gateway**: Realistic Razorpay-inspired checkout workflow for mock transaction completion.
- 🛡️ **Administrative Suite**: Platform overview analytics, KYC verification queues, and dispute resolution interfaces.
- ♻️ **Recycling Lifecycle Visualization**: Visual breakdown tracking textile waste from raw collection to upcycled end-products.
- 🌐 **Multilingual Interface**: Bilingual support for **English** and **Hindi** powered by an internal i18n engine.
- 🎨 **Modern Experience**: Cinematic landing aesthetics featuring animated counters and interactive loaders.

---

## Tech Stack & Architecture

- **UI Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Mapping**: Leaflet / React-Leaflet
- **Icons**: Lucide React
- **Data Persistence**: In-memory seed database with Browser LocalStorage synchronization

---

## Quick Start

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (packaged with Node.js)

### Installation & Local Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/kapadasetu.git
   cd kapadasetu

 * Install dependencies:
   npm install

 * Launch development server:
   npm run dev

 * View application:
   Open your browser and navigate to http://localhost:3000.
Build Scripts
| Script | Command | Description |
|---|---|---|
| Development | npm run dev | Runs the app in development mode with HMR on port 3000 |
| Type Check | npm run lint | Runs tsc --noEmit to validate TypeScript types across the repo |
| Production Build | npm run build | Compiles and optimizes assets into the dist/ directory |
| Preview Build | npm run preview | Locally serves the production dist/ build for verification |
Directory Structure
KapadaSETU/
├── src/
│   ├── components/            # UI components and view controllers
│   │   ├── AdminDashboard.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── BuyerDashboard.tsx
│   │   ├── CinematicBackground.tsx
│   │   ├── DealDetail.tsx
│   │   ├── ListingDetail.tsx
│   │   ├── MapComponent.tsx
│   │   ├── Navbar.tsx
│   │   ├── Onboarding.tsx
│   │   ├── RazorpayModal.tsx
│   │   ├── RecyclingJourney.tsx
│   │   ├── SellerDashboard.tsx
│   │   └── WeaveLoader.tsx
│   ├── App.tsx                # Main application component & routing state
│   ├── db.ts                  # Mock database state engine & CRUD utilities
│   ├── i18n.tsx               # Localization dictionary (EN / HI)
│   ├── main.tsx               # Application entry point
│   ├── types.ts               # Shared TypeScript models and enums
│   └── vite-env.d.ts          # Environment type declarations
├── supabase/
│   └── migrations/            # SQL schemas ready for future database integration
├── package.json
├── tsconfig.json
└── vite.config.ts

Future Backend Expansion
While this client application operates standalone out-of-the-box, full PostgreSQL schemas are provided under supabase/migrations/. These scripts allow seamless backend integration with Supabase or any Postgres instance to transition from local mock data to real-time persistent cloud storage.
License
This project is open-source and available under the MIT License.

