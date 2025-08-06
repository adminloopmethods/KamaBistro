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

```prisma
enum Role {
  ADMIN
  VERIFIER
  EDITOR
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String
  phone        String?
  password     String
  role         Role      @default(EDITOR)
  autoApproval Boolean   @default(false)
  deleted      Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @default(now())
  status       Boolean   @default(true)
  locationId   String?
  location     location? @relation(fields: [locationId], references: [id])

  Log Log[]

  editedWebpages   Webpage[] @relation("WebpageEditor")
  verifiedWebpages Webpage[] @relation("WebpageVerifier")
}
```

* Users have roles: `ADMIN`, `VERIFIER`, `EDITOR` (`ADMIN` only one in whole application and can not be created another)
* Fields include email, name, phone, password, status, soft deletion, and timestamps
* Users generate logs (Log\[])
* Relations:
  - `editedWebpages`: Webpages where the user is the editor
  - `verifiedWebpages`: Webpages where the user is the verifier
  - `location`: Optional relation to a location

### Webpage

```prisma
model Webpage {
  id         String    @id
  name       String
  locationId String?
  location   location? @relation(fields: [locationId], references: [id])

  contents   Content[]

  editorId   String?
  editor     User?   @relation("WebpageEditor", fields: [editorId], references: [id])

  verifierId String?
  verifier   User?   @relation("WebpageVerifier", fields: [verifierId], references: [id])
}
```

- Fields: id, name, locationId, editorId, verifierId, etc.
- Relations:
  - `editor`: User assigned as editor
  - `verifier`: User assigned as verifier
  - `location`: Optional relation to a location
  - `contents`: List of content blocks for the page

### 🧱 Content Model

```prisma
model Content {
  id        String  @id
  name      String
  order     Int     @default(0)
  webpage   Webpage @relation(fields: [webpageId], references: [id])
  webpageId String

  elements Element[]
  style    Style     @relation("ContentStyle", fields: [styleId], references: [id])
  styleId  String    @unique
}
```

* Child of `Webpage`
* Contains `Elements` (individual blocks of content)
* Linked to a unique `Style`

### 🔤 Element Model

```prisma
model Element {
  id      String @id
  name    String
  content String
  order   Int    @default(0)

  contentId  String
  contentRef Content @relation(fields: [contentId], references: [id])

  style   Style  @relation("ElementStyle", fields: [styleId], references: [id])
  styleId String @unique
}
```

* Belongs to `Content`
* Contains textual/HTML content
* Linked to a unique `Style`

### 🎨 Style Model

```prisma
model Style {
  id String @id @default(uuid())

  xl Json?
  lg Json?
  md Json?
  sm Json?

  content Content? @relation("ContentStyle")
  element Element? @relation("ElementStyle")
}
```

* Holds responsive styles for: xl, lg, md, sm
* Can be attached to a `Content` or an `Element`

### Location
```prisma
model location {
  id      String    @id @default(uuid())
  name    String
  User    User[]
  Webpage Webpage[]
}
```
- Used for grouping users and webpages by physical or logical location

### 🧾 Log Model

```prisma
model Log {
  id        String   @id @default(uuid())
  action    String
  message   String?
  userId    String? // Nullable if not related to a user
  timestamp DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])
}
```

* Records actions (e.g., login, update)
* May be linked to a user

---

## 🔗 Relationships

- **User 1:N Log** — One user can have many logs; each log optionally belongs to a user.
- **User 1:N Webpage (as Editor)** — One user (as editor) can edit many webpages (`editedWebpages`).
- **User 1:N Webpage (as Verifier)** — One user (as verifier) can verify many webpages (`verifiedWebpages`).
- **Webpage N:1 User (as Editor/Verifier)** — Each webpage has one editor and one verifier (both are users).
- **Webpage 1:N Content** — A webpage contains many content blocks.
- **Content 1:N Element** — A content block can have many elements.
- **Content 1:1 Style** — Each content block has a unique style.
- **Element 1:1 Style** — Each element has a unique style.
- **User N:1 Location** — Many users can belong to one location.
- **Webpage N:1 Location** — Many webpages can belong

---

## 🚦 API Endpoints

```js
"/auth"
    router.post("/login");
    router.post("/forget_password"); // yet to be created

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

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3001,http://127.0.0.1:3002

SUPERUSER_EMAIL="your@email.com"
SUPERUSER_PASSWORD="password@123"
SUPERUSER_NAME="Super User"

JWT_SECRET=your_jwt_key
TOKEN_EXPIRES_IN=1d
```
