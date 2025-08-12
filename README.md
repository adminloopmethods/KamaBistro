# Shade CMS

A comprehensive Content Management System built with modern web technologies, featuring a role-based management system, user creation, and page content update capabilities. The system supports multiple roles with a workflow that includes editing, verification, and publishing stages.

## 🏗️ Architecture

The Shade CMS project consists of three main components:

- **Backend API** - Node.js/Express server with PostgreSQL database (runs in Docker)
- **Dashboard** - React-based admin panel for content management (runs locally)
- **Website** - Next.js frontend website (runs locally)

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access control
- **File Upload**: Cloudinary integration
- **API Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Containerization**: Docker

### Dashboard (CMS Admin Panel)
- **Framework**: React 18
- **Styling**: Tailwind CSS with DaisyUI
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Charts**: Chart.js with React Chart.js 2
- **Rich Text Editor**: Jodit React
- **Notifications**: React Toastify

### Website (Frontend)
- **Framework**: Next.js 14
- **Styling**: Sass
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Carousel**: Swiper

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## ⚙️ Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shade_cms
   ```

2. **Create environment file**

   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DB=shade_cms_db
   POSTGRES_PORT=5432
   DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}

   # Backend Configuration
   BACKEND_PORT=3000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Dashboard Configuration
   DASHBOARD_PORT=3001

   # Website Configuration
   WEBSITE_PORT=3002

   # Cloudinary Configuration (for file uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password

   # PgAdmin (Optional)
   PGADMIN_USER=admin@example.com
   PGADMIN_PASSWORD=admin_password
   PGADMIN_PORT=8080
   ```

## 🐳 Running with Docker

### Backend (Docker)

The backend runs inside Docker containers along with PostgreSQL database.

1. **Start the backend services**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port `5432`
   - Backend API on port `3000`

2. **Check running containers**
   ```bash
   docker-compose ps
   ```

3. **View backend logs**
   ```bash
   docker-compose logs backend
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Database Setup

1. **Run Prisma migrations** (after backend is running)
   ```bash
   cd backend
   npm run prisma:migrate:local
   ```

2. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

3. **Seed the database** (optional)
   ```bash
   node prisma/seed.js
   ```

## 💻 Running Locally

### Dashboard (Admin Panel)

The dashboard runs locally and connects to the Docker backend.

1. **Navigate to dashboard directory**
   ```bash
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

   The dashboard will be available at `http://localhost:3001`

### Website (Frontend)

The website also runs locally.

1. **Navigate to website directory**
   ```bash
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The website will be available at `http://localhost:3002`

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## 🔐 Authentication & Roles

The system implements a comprehensive role-based access control system:

### User Roles
- **Super Admin**: Full system access
- **Manager**: Page and resource management
- **Editor**: Content editing capabilities
- **Verifier**: Content verification and approval
- **Publisher**: Final content publishing

### Permissions
- `PAGE_MANAGEMENT`: Manage main pages
- `SINGLE_RESOURCE_MANAGEMENT`: Manage individual resources
- `EDIT`: Edit content
- `VERIFY`: Verify and approve content
- `PUBLISH`: Publish content

## 🔄 Content Workflow

1. **Edit**: Content creators/editors modify content
2. **Verification**: Verifiers review and approve changes
3. **Publishing**: Publishers make content live
4. **Version Control**: All changes are tracked with version history

## 📁 Project Structure

```
shade_cms/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, content, etc.)
│   │   ├── config/         # Configuration files
│   │   ├── helper/         # Utility functions
│   │   ├── repository/     # Data access layer
│   │   └── validation/     # Input validation schemas
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile          # Docker configuration
├── dashboard/              # React admin panel
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Feature-specific components
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── website/                # Next.js frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Next.js pages
│   │   └── styles/         # Styling files
│   └── public/             # Static assets
├── DOC/                    # Documentation files
├── docker-compose.yml      # Docker services configuration
└── README.md              # This file
```

## 🛠️ Development Commands

### Backend
```bash
# Start with local environment
npm run start:local

# Run Prisma migrations
npm run prisma:migrate:local

# Generate Prisma client
npm run prisma:generate
```

### Dashboard
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Website
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check database credentials in `.env` file
   - Verify DATABASE_URL format

2. **Port Conflicts**
   - Check if ports 3000, 3001, 3002, 5432 are available
   - Modify ports in `.env` and `docker-compose.yml` if needed

3. **Docker Issues**
   - Restart Docker services: `docker-compose restart`
   - Rebuild containers: `docker-compose up --build`
   - Clear Docker cache: `docker system prune`

4. **Node Modules Issues**
   - Clear node_modules: `rm -rf node_modules package-lock.json`
   - Reinstall dependencies: `npm install`

### Logs and Debugging

- **Backend logs**: `docker-compose logs backend`
- **Database logs**: `docker-compose logs postgres`
- **Dashboard logs**: Check browser console and terminal
- **Website logs**: Check browser console and terminal

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **akshayKmr** - Initial development

## 🆘 Support

For support and questions:
- Check the documentation in the `DOC/` directory
- Review API documentation at `http://localhost:3000/api-docs`
- Create an issue in the repository

---

**Note**: This CMS system is designed for Shade Corporation's content management needs with a focus on role-based workflows and content versioning.