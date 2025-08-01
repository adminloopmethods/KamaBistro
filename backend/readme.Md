# 📦 Backend - CMS

## 🛠 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Environment Config**: dotenv
* **CORS Configuration**: Custom with middleware

---

## 🧩 Folder Structure

```
backend/
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     
│
├── src/
│   ├── config/           # Configuration files (e.g., CORS)
│   ├── constants/        # Constants used across the app
│   ├── controllers/      # Express route handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Prisma client setup
│   ├── routes/           # API route definitions
│   ├── service/          # Business logic separated from routes/controllers
│   ├── utils/            # Utility functions (e.g., logger)
│   └── server.js         # Entry point for backend server
│
├── authRes.json          # Static response mock (temporary/test use)
├── package.json
└── README.md
```

---

## 🧬 Database Schema (Prisma)

### 👤 User Model

* Users have roles: `ADMIN`, `MANAGER`, `EDITOR` (`ADMIN` only one in whole application and can not be created another)
* Fields include email, name, phone, password, status, soft deletion, and timestamps
* Users generate logs (Log\[])

### 📄 Webpage Model

* Represents a web page with a name
* Has multiple `Content` entries (sections of the page)

### 🧱 Content Model

* Child of `Webpage`
* Contains `Elements` (individual blocks of content)
* Linked to a unique `Style`

### 🔤 Element Model

* Belongs to `Content`
* Contains textual/HTML content
* Linked to a unique `Style`

### 🎨 Style Model

* Holds responsive styles for: xl, lg, md, sm
* Can be attached to a `Content` or an `Element`

### 🧾 Log Model

* Records actions (e.g., login, update)
* May be linked to a user

---

## 🔗 Relationships

* **User 1\:N Log** — One user can have many logs
* **User 1\:N Webpage** — One user can have many Webpage
* **Webpage 1:3 Users** — A webpage can have max three users to make changes
* **Webpage 1\:N Content** — A webpage contains many content blocks
* **Content 1\:N Element** — A content block can have many elements
* **Content 1:1 Style** — Each content block has a unique style
* **Element 1:1 Style** — Each element has a unique style
* **Log N:1 User** — Each log optionally belongs to a user

---

## 🚀 Routes

```js
"/auth"
    router.post("/login");
    router.post("/login"); // yet to be created

"/users"
    router.get("/"); // all user
    router.post("/register");
    router.get("/:id"); // unique user
    router.put("/:id"); // general update
    router.put("/switchStatus/:id") // status toggle update
    router.delete("/:id");

"/content" // there is going to be more if required
    router.post("/"); // create 
    router.get("/"); // get all
    router.get("/:id"); // get a single
    router.put("/:id"); // for edit page
"/logs" 
    router.get("/") // get logs
    router.post("/delete"); // delete logs
```

---

## 🧪 Running Locally

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Start the server
npm run dev

# Generate Prisma client
npx prisma generate

# Run Prisma migrations
npx prisma migrate dev
```

---

## 🧠 Notes

* Soft deletion for users is handled via a `deleted` boolean
* Timestamps are auto-generated with `@default(now())`
* Prisma `@relation` is used extensively for data integrity

---

## 📎 Environment Variables (.env)

```
DATABASE_URL=

PORT=9000

CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5174,http://127.0.0.1:5175

SUPERUSER_EMAIL="your@email.com"
SUPERUSER_PASSWORD="password@123"
SUPERUSER_NAME="Super User"

JWT_SECRET=your_jwt_key
TOKEN_EXPIRES_IN=1d
```
