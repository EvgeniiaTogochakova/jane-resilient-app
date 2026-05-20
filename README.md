# Jane Resilient App

A modern, high-performance React application for user management, built with a strict focus on code reusability, enterprise-grade form validation, and a resilient, fault-tolerant front-end architecture.

## Key Features

* **Two-page Dynamic Navigation:**
  * **Main Page (`/`):** A responsive user grid complete with client-side pagination, search filtering, and an integrated modal for Create/Edit operations.
  * **Details Page (`/users/:id`):** Deep dive into specific profile parameters powered by React Router loaders.
* **Input Validation:** Form fields are thoroughly sanitized and validated on the client side, protecting the application from malformed data and eliminating unnecessary network overhead.
* **Scalable Core Architecture:** Custom, abstract CRUD hook factory built with TanStack Query and Axios, supporting strict type-safety via TypeScript.
* **Network & Asset Resilience:** Features progressive skeleton loader screens to eliminate layout shifts, and incorporates automatic graceful degradation (fallback layouts) for missing or broken remote image URLs.
* **Proactive UI Locking:** Modals and submission buttons lock instantly upon network trigger execution to eliminate double-submit race conditions over slow REST servers.
* **User Feedback:** Unified notification streams managed via Notistack to relay real-time API operational success/error vectors.

## Tech Stack

* **React 19 + Vite** — Core UI runtime and build toolchain.
* **TypeScript** — Strict static typing across the entire codebase.
* **TanStack Query (v5)** — Declarative server-state orchestration, pre-fetching, and reactive caching layer.
* **React Hook Form** — Performance-optimized, uncontrolled form state management.
* **Zod** — Type-safe, schema-driven runtime object validation and data transformation.
* **Axios** — HTTP client for structured API requests.
* **React Router Dom (v6)** — Standard single-page application routing, error boundaries, and cache-warming loaders.
* **MUI (Material UI)** — Enterprise design system components and responsive grid structures.
* **MockAPI.io** — Dedicated remote REST API endpoint backend simulator.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EvgeniiaTogochakova/jane-resilient-app.git
   cd jane-resilient-app
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` configuration file in the root directory and append your specific endpoint target:
   ```env
   VITE_API_BASE_URL=https://mockapi.io
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
