# 📊 CMS Dashboard (Next.js + TypeScript)

A CMS Dashboard built with **Next.js**, **TypeScript**, and **Tailwind CSS**. This interface allows Super Users and Managers to create, manage, and approve website pages and content dynamically.

---

## ✅ Brand Assigning

```bash
"index.html" -> "title tag"       # The HTML file in root
"Header.tsx" -> "Brand prop"      # Header component
"logo"       -> "in assets"       # Brand logo
```

---

## 📁 Folder Structure

```
dashboard_next/
├── public/
├── src/
│   ├── app/                     # Next.js App directory (auth, dashboard, layout)
│   ├── assets/                  # Brand images, login assets
│   ├── Context/                 # Context providers (Editor, Theme)
│   ├── functionality/           # Utility functions (fetch, fingerprint, toast)
│   └── utils/                   # API endpoints and shared utils
├── node_modules/
├── .eslintrc.config.mjs         # ESLint config
├── postcss.config.mjs           # PostCSS config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.ts               # Next.js config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 👥 User Roles

### 1. Super User (Admin)
- Manage all users and content.
- Full access to approvals and analytics.

### 2. Manager
- Can approve or reject editor submissions.
- Moderate users under them.

### 3. User Editor
- Create/edit content.
- Submit pages for manager approval.

---

## 🧠 Core Functionality

| File/Folder                      | Purpose                                          |
| -------------------------------- | ------------------------------------------------ |
| `functionality/fetch.ts`         | Custom fetch with token handling, timeout, etc. |
| `functionality/fingerprint.ts`   | Device fingerprint using FingerprintJS          |
| `functionality/ToastWithUpdate.ts` | Toast wrapper for async status messages       |
| `Context/EditorContext.tsx`      | Context provider for WYSIWYG-style editor state |
| `utils/endpoints.ts`             | Centralized API route config                    |

---

## 🔌 API Integration

- API endpoints defined in `utils/endpoints.ts`
- Generic request function: `functionality/fetch.ts`
- Session timeout handling & redirect included

---

## 🧪 Dev Tools & Config

- **Next.js**: SSR/SSG, Routing, App Directory
- **TypeScript**: Type safety throughout
- **Tailwind CSS**: Utility-first styling
- **ESLint**: Project linting
- **PostCSS**: Extended CSS processing

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

> Ensure `.env.local` has the correct `NEXT_PUBLIC_BACK_ENDPOINT` set for API base URL.
