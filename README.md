# Issue Tracker API

A Issue Tracking system built with NestJS, TypeORM, and PostgreSQL, featuring real-time time tracking capabilities.

## Features

- **Issue Management**
  - Create, read, update, and delete issues
  - Status tracking (open, in progress, closed)
  - Detailed issue descriptions
- **Time Tracking**
  - Start/stop time tracking for issues
  - Multiple time entries per issue
  - Automatic time calculations
  - Real-time duration tracking

## 🛠 Tech Stack

- **Backend Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Testing:** Jest

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- Docker & Docker Compose (optional)

## 🚀 Getting Started

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/issue-tracker.git
   cd issue-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials:

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=issue_tracker
   ```

4. **Run migrations**

   ```bash
   npm run migration:run
   ```

5. **Start the development server**
   ```bash
   npm run start:dev
   ```

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 📡 API Endpoints

### Issues

- `GET /issues` - Get all issues
- `POST /issues` - Create a new issue
- `PATCH /issues/:id` - Update an issue
- `DELETE /issues/:id` - Delete an issue

### Time Tracking

- `POST /issues/:id/start` - Start time tracking
- `POST /issues/:id/stop` - Stop time tracking

## 💡 Example Usage

### Creating an Issue

```bash
curl -X POST http://localhost:3000/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system"
  }'
```

### Starting Time Tracking

```bash
curl -X POST http://localhost:3000/issues/1/start
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm run test

```

## 📚 Database Schema

The application uses three main entities:

- **Issues**

  - id (PK)
  - title
  - description
  - status_id (FK)
  - created_at
  - updated_at

- **Issue Statuses**

  - id (PK)
  - name

- **Time Entries**
  - id (PK)
  - issue_id (FK)
  - start_time
  - end_time
  - created_at
