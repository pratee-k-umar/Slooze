# Slooze.xyz - Food Ordering Platform

A full-stack food ordering application with role-based access control and country-scoped data filtering.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeORM and PostgreSQL
- **Authentication**: JWT-based authentication with role-based access control

## 👥 User Roles

- **Member**: Can browse restaurants, create orders, and view their own orders
- **Manager**: Can manage orders within their country and checkout/cancel orders
- **Admin**: Full access to all features across all countries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Slooze
   ```

2. **Setup Backend**

   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your database credentials (see Environment Variables section below)
   npm run seed  # Seed database with test data
   npm run start:dev
   ```

3. **Setup Frontend** (in a new terminal)

   ```bash
   cd client
   npm install
   cp .env.example .env.local
   # Edit .env.local if needed (default: http://localhost:4000)
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## ⚙️ Environment Variables

### Backend (.env)

Create `server/.env` from `server/.env.example`:

```env
# Database Configuration (Required)
DATABASE_URL=postgresql://username:password@host:port/database
# Example for local PostgreSQL:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/slooze

# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port (Optional, default: 4000)
PORT=4000
```

**Important Notes:**

- For cloud PostgreSQL (e.g., Render, Supabase), use the connection string they provide
- The `JWT_SECRET` should be a long, random string in production
- Database tables will be created automatically on first run (TypeORM sync)

### Frontend (.env.local)

Create `client/.env.local` from `client/.env.example`:

```env
# Backend API URL (Required)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Important Notes:**

- Change to your production backend URL when deploying
- Must start with `NEXT_PUBLIC_` to be accessible in the browser

## 🧪 Test Users

After seeding, use these credentials to login:

| Email                | Password    | Role    | Country |
| -------------------- | ----------- | ------- | ------- |
| nick.fury@shield.com | password123 | Admin   | -       |
| steve.rogers@usa.com | password123 | Manager | USA     |
| tony.stark@usa.com   | password123 | Member  | USA     |
| bruce.wayne@uk.com   | password123 | Manager | UK      |
| diana.prince@uk.com  | password123 | Member  | UK      |

## 📁 Project Structure

```
Take-Home/
├── client/          # Next.js frontend application
│   ├── app/         # App router pages
│   ├── src/         # Components, contexts, and utilities
│   └── README.md    # Frontend-specific documentation
├── server/          # NestJS backend application
│   ├── src/         # Source code
│   └── README.md    # Backend-specific documentation
└── README.md        # This file
```

## 🔑 Key Features

- **Restaurant Management**: Browse and view restaurant menus
- **Shopping Cart**: Add items to cart with quantity management
- **Order Management**: Create, view, checkout, and cancel orders
- **Payment Methods**: Admin can manage payment methods
- **Role-Based Access**: Different permissions for Member, Manager, and Admin
- **Country Scoping**: Managers only see data from their country

## 📚 Documentation

- [Client README](./client/README.md) - Frontend setup and development
- [Server README](./server/README.md) - Backend setup and API documentation
- [Postman Testing Guide](./POSTMAN_TESTING_GUIDE.md) - API testing guide

## 🛠️ Development

- **Frontend**: Runs on port 3000 with hot reload
- **Backend**: Runs on port 4000 with auto-restart on file changes
- **Database**: PostgreSQL with TypeORM auto-sync enabled in development

## 🐳 Docker Deployment

The application can be deployed using Docker Compose with a cloud database:

1. **Create environment file**

   ```bash
   cp .env.example .env
   # Edit .env with your cloud DATABASE_URL and JWT_SECRET
   ```

2. **Build and run**

   ```bash
   docker-compose up -d
   ```

3. **Seed the database** (first time only)

   ```bash
   docker-compose exec server npm run seed
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

**Note**: The docker-compose.yml is configured to use a cloud PostgreSQL database. Make sure to set your `DATABASE_URL` in the `.env` file before running.

## 📝 License

MIT
