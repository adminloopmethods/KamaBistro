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
├── dashboard/                # CMS UI (React + Vite)
│   ├── src/                 # Components, pages, routes, etc.
│   ├── public/              # Static assets
│   ├── index.html           # Main HTML entry
│   ├── package.json         # Dashboard dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.js       # Vite bundler config
│
├── backend/                  # REST API and Database
│   ├── prisma/               # Prisma schema and migrations
│   ├── src/
│   │   ├── config/           # App configuration files
│   │   ├── constants/        # Constants
│   │   ├── controllers/      # Route logic
│   │   ├── middlewares/      # Custom Express middlewares
│   │   ├── models/           # Prisma Client setup
│   │   ├── routes/           # Route definitions
│   │   ├── service/          # Business logic
│   │   ├── utils/            # Helper functions
│   │   └── server.js         # Entry point
│   ├── package.json          # Backend dependencies
│   └── authRes.json          # Sample auth response
│
├── frontend/                 # Public-facing site (Next.js, planned)
│   ├── src/                  # Will contain UI for visitors
│   ├── public/               # Static assets
│   ├── next.config.ts        # Next.js config
│   ├── tsconfig.json         # TypeScript config
│   ├── package.json
│   └── README.md             # Frontend-specific notes
│
└── README.md                 # Project overview and setup
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
- [ ] CMS UI using Next.js + Tailwind
- [ ] Frontend website using Next.js
- [ ] Role-based access (Editor, Viewer)
- [ ] Drag-and-drop page builder
- [ ] Deployment with Docker
