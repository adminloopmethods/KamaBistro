# 📊 CMS Dashboard

A CMS Dashboard built with **React**, **Vite**, and **Tailwind CSS**. This interface allows Super Users and Managers to create, manage, and approve website pages and content dynamically.

---
## Brand Assinging
```bash
"index.html" "title tag" # the html file in root
"Header.jsx" "Brand prop" # Header component
"index.js" "import and export logo" # the file in assets for brand logo
```
---

## 📁 Folder Structure

```
dashboard/
├── public/
├── src/
│   ├── app/                     # Common logic (API, string ops, click handling, etc.)
│   ├── assets/                  # Images, icons, logos
│   ├── Components/
│   │   ├── Editor/              # Section/Element editors
│   │   │   └── elements/        # Individual element UIs
│   │   └── tools/               # UI Toolbars (Text, Image, Style, etc.)
│   ├── Context/                 # Context API and theme provider
│   ├── Functionality/           # Core functions (createSection, toast, Z-index counter)
│   ├── pages/
│   │   ├── auth/                # Login page and image assets
│   │   ├── common/              # Shared/common pages
│   │   └── Dashboard/           # Main dashboard views
│   │       ├── component/       # Sidebar, header, user table, dialogs, etc.
│   │       └── elem-dashboard/  # Reusable inputs, search, submit buttons
│   ├── routes/                  # Route definitions
│   ├── utils/
│   │   ├── endpoints/           # API endpoints
│   │   └── validator/           # Form and field validators
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
├── index.html
└── README.md
```

---


---

## 👥 User Roles

### 1. Super User (Admin)

* Can create and manage all pages and users.
* Has full access to logs, analytics, and content tools.

### 2. Manager

* Can manage user editors under them.
* Can approve/reject content submitted by editors.

### 3. User Editor

* Can create/edit sections and elements.
* Submits changes for manager approval.

---

## 🧠 Core Functionality

| File/Folder                          | Purpose                                         |
| ------------------------------------ | ----------------------------------------------- |
| `Functionality/createSection.js`     | Create a new section in the webpage editor      |
| `Functionality/createElement.js`     | Add a new element inside a section              |
| `Functionality/toastWithUpdate.js`   | Custom toast notifications with update messages |
| `Functionality/globalZIndCounter.js` | Maintains unique Z-index for UI stacking        |

---

## 🧩 Component Highlights

### ➤ `src/pages/Dashboard/`

* `Dashboard.jsx` – Main entry layout
* `Users.jsx` – Table, add/edit users, role toggle
* `Overview.jsx`, `Logs.jsx`, `Analytics.jsx` – Planned analytics, logs
* `Pages.jsx` – Page list UI

### ➤ `src/pages/Dashboard/component/`

* `Sidebar.jsx`, `Header.jsx` – Dashboard layout UI
* `UserFormDialog.jsx` – Create/edit user form
* `TableComp.jsx`, `SearchAndFilter.jsx` – Dynamic tables and search tools

### ➤ `src/Components/tools/`

* `RichtextToolbar.jsx` – For text elements
* `ImageToolbar.jsx` – Image upload and controls
* `StyleToolbar.jsx`, `DimensionToolbar.jsx` – Styling and size editing

---

## 🔌 API Integration

* All API requests handled in `src/app/fetch.js`
* Endpoints configured in `src/utils/endpoints/endpoints.js`
* Form validations in `src/utils/validator/validateEmptyFields.js`

---

## 🧪 Dev Tools & Config

* ESLint: `eslint.config.js`
* PostCSS: `postcss.config.js`
* Tailwind: `tailwind.config.js`
* Vite: `vite.config.js`

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```
