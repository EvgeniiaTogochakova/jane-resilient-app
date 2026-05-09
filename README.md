## Jane Resilient App

A modern React application for user management, built with a focus on code reusability, state management, and "resilient" architecture.

## 🚀 Key Features

* Two-page Navigation:
* Main Page: A data grid with user list, pagination, and a modal for Create/Edit operations.
   * Details Page: Deep dive into specific user data with dynamic routing.
* Scalable API Layer: Custom CRUD hook factory built with TanStack Query and Axios.
* Modern UI: Styled with Material UI (MUI) using a responsive grid and accessible components.
* User Feedback: Global notification system using Notistack to handle API success/error states.

## 🛠 Tech Stack

* React 19 + Vite
* TypeScript
* TanStack Query (v5) (Server state & Caching)
* Axios (HTTP client)
* React Router Dom (Routing)
* MUI (Material UI) (UI Components)
* MockAPI.io (Backend emulator)

## 🔧 Installation & Setup

   1. Clone the repository
   2. Install dependencies: npm install
   3. Create a .env.local file based on .env and add your VITE_API_BASE_URL.
   4. Run the app: npm run dev

