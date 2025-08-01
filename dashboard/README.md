# KamaBistro CMS

**KamaBistro CMS** is a user-based content management system (CMS) where a Super User can initially create and manage website pages. Built with a modern tech stack for flexibility and scalability.

---

## 📌 Purpose

To provide a CMS platform where users can visually create and manage website pages and their content dynamically. The initial version is designed for a Super User to have complete control over the structure and styling of site pages.

---

## 🧰 Tech Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| CMS         | React + Vite + Tailwind CSS          |
| Frontend    | Next.js *(to be implemented)*        |
| Backend     | Node.js + Express                    |
| Database    | PostgreSQL + Prisma ORM              |

---

## 🗂 Project Structure

```bash
kamabistro/
│
├── dashboard/                  # CMS UI (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── vite.config.js          # Vite config
│
├── backend/                    # REST API and Database (Express + PostgreSQL + Prisma)
│   ├── prisma/                 # Prisma schema and migrations
│   ├── src/
│   │   ├── config/             # App configuration files
│   │   ├── constants/          # Constants used in app
│   │   ├── controllers/        # Route logic handlers
│   │   ├── middlewares/        # Custom Express middlewares
│   │   ├── models/             # Prisma Client setup
│   │   ├── routes/             # API route definitions
│   │   ├── service/            # Business logic layer
│   │   ├── utils/              # Utility/helper functions
│   │   └── server.js           # Entry point of the backend
│   ├── package.json
│   └── authRes.json            # Sample API response (for testing or mocking)
│
├── frontend/                   # Public-facing website (Next.js + TypeScript)
│   ├── public/                 # Static assets (images, fonts, etc.)
│   ├── src/                    # Application source code
│   │   ├── app/                # App Router (if used)
│   │   ├── pages/              # Pages (if using Pages Router)
│   │   ├── components/         # Reusable UI components
│   │   ├── styles/             # Tailwind / global styles
│   │   └── utils/              # Shared utility functions
│   ├── package.json            # Frontend dependencies and scripts
│   ├── next.config.ts          # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── eslint.config.mjs       # ESLint configuration
│   ├── postcss.config.mjs      # PostCSS config (for Tailwind)
│   └── next-env.d.ts           # TypeScript Next.js environment definitions
│
└── ProjectDetails.md           # Project documentation (this file)

```

---

## ⚙️ Getting Started

### 1. Clone the Project

```bash
git clone git@github.com:anukool-loop/kama-bistro.git
cd kama-bistro 
```

### 2. Backend Setup
```bash
cd backend
npm install
```

#### Create .env file:
```ini
DATABASE_URL=postgresql://user:password@localhost:5432/kamabistro
JWT_SECRET=your_jwt_secret
```

#### Run database migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Start the server
```bash
node src/server.js
```

### 3. CMS (Dashboard) Setup
```bash
cd dashboard
npm install
npm run dev
```

### 4. Frontend (Next.js)
```bash
cd render
npm install
npm run dev
```

## 🔐 Authentication & Roles
- JWT-based authentication

- Super User has access to create and manage pages.

- Roles and permissions will be extended for Editors, Viewers, etc.

Relevant files:

- controllers/authController.js

- middlewares/authMiddleware.js

- service/userService.js

## 🚧 Roadmap

- [x] Backend with Express + PostgreSQL
- [ ] CMS UI using React + Vite + Tailwind
- [ ] Frontend website using Next.js
- [ ] Role-based access (Editor, Viewer)
- [ ] Drag-and-drop page builder
- [ ] Deployment with Docker
