# System Architecture Documentation

## Overview

The JM Comfort system follows a three-tier architecture consisting of a frontend client, backend API server, and MySQL database. Each component is responsible for a specific layer of the application, ensuring separation of concerns and scalability.

## Components

### Frontend

The frontend is a React-based web application that provides the user interface and handles client-side interactions.

Responsibilities:
- Render UI components
- Handle user input
- Send API requests to backend
- Display API responses
- Manage client-side routing
- Perform form validation

Technology:
- React
- JavaScript / TypeScript
- CSS
---

### Backend

The backend is a Node.js / Express API server responsible for business logic and data processing.

Responsibilities:
- Handle REST API requests
- Authenticate users
- Validate incoming data
- Execute business logic
- Communicate with database
- Return JSON responses
- Log errors and metrics

Technology:
- Node.js
- Express
- Sentry (error monitoring)

---

### Database

The system uses a MySQL database to store persistent application data.

Responsibilities:
- Store user information
- Store application content
- Store analytics data
- Store configuration settings
- Support backup and recovery

Technology:
- MySQL
- mysqldump for backups

## System Flow

The following describes how data flows through the system:

1. User interacts with the frontend application
2. Frontend sends HTTP request to backend API
3. Backend receives and validates request
4. Backend performs authentication (if required)
5. Backend queries MySQL database
6. Database returns requested data
7. Backend formats response
8. Backend sends JSON response to frontend
9. Frontend updates UI with returned data

## Architecture Diagram

    ┌───────────┐
    │   User    │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │  Frontend │
    │   React   │
    └─────┬─────┘
          │ API Requests
          ▼
    ┌───────────┐
    │  Backend  │
    │ Node/Express
    └─────┬─────┘
          │ SQL Queries
          ▼
    ┌───────────┐
    │  MySQL DB │
    └───────────┘

## External Integrations

The system integrates with the following external services:

- Sentry for error monitoring
- Analytics tracking tools
- Performance metrics collection
- Backup scripts for database protection

## Environment Configuration

The application relies on environment variables defined in `.env`:

| Variable | Description |
|----------|-------------|
| DB_HOST | Database host |
| DB_PORT | Database port |
| DB_NAME | Database name |
| DB_USER | Database username |
| DB_PASS | Database password |
| SENTRY_DSN | Sentry error monitoring key |

## Security Considerations

- JWT-based authentication
- Protected admin routes
- Environment variable configuration
- Input validation
- Secure database credentials
- Error logging and monitoring

## Deployment Architecture

Production deployment includes:

- Frontend hosted on web server
- Backend running Node.js service
- MySQL database instance
- Environment variable configuration
- Scheduled database backups

## Scalability

The architecture supports future scaling by:

- Separating frontend and backend services
- Allowing database to run on dedicated server
- Supporting horizontal backend scaling
- Using CDN for static frontend assets