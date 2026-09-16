# Auth Microservice

A secure authentication microservice built with Node.js, Express, TypeScript, and MongoDB. It implements JWT-based authentication with both access and refresh tokens, user registration, login, and secure password management.

## Features

- **User Registration & Login**: Secure password hashing with `bcrypt`.
- **JWT Authentication**: Short-lived access tokens and long-lived refresh tokens.
- **Session Management**: Logout and logout-all (invalidate all sessions) functionality.
- **Role-Based Access Control**: Middleware to restrict routes by user roles.
- **Rate Limiting**: Protection against brute-force login attacks.
- **Input Validation**: Strongly typed schema validation using `zod`.
- **Security Headers**: Basic protection via `helmet`.
- **TypeScript**: fully strongly typed codebase.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) (optional, for running local MongoDB)
- MongoDB (local or Atlas cluster)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Lakshay-Trehan-2005/auth-service-gemini-.git
cd auth-service-gemini-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the `.env.example` file to `.env` and configure your variables:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server runs on | `3000` |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb://127.0.0.1:27017/auth-service` |
| `JWT_ACCESS_SECRET` | Secret key for access tokens | `your_access_secret` |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | `your_refresh_secret` |
| `JWT_ACCESS_EXPIRES_IN`| Access token lifespan | `15m` |
| `JWT_REFRESH_EXPIRES_IN`| Refresh token lifespan | `7d` |

### 4. Start MongoDB

If you don't have MongoDB installed locally, you can use the provided `docker-compose.yml` file to spin up a container quickly:

```bash
docker compose up -d
```

### 5. Run the server

**Development mode** (with nodemon):
```bash
npm run dev
```

## API Documentation

### Auth Routes (`/api/auth`)

- `POST /register`: Register a new user account.
- `POST /login`: Authenticate and receive tokens.
- `POST /refresh`: Exchange a valid refresh token for a new access token.
- `POST /logout`: Invalidate the current session (Requires `Authorization: Bearer <token>`).
- `POST /logout-all`: Invalidate all sessions for the user (Requires `Authorization: Bearer <token>`).
- `POST /change-password`: Change the user's password (Requires `Authorization: Bearer <token>`).

### User Routes (`/api/users`)

- `GET /me`: Get the current authenticated user's profile (Requires `Authorization: Bearer <token>`).

## Testing

You can use the provided `test-api.js` script to quickly test the core authentication flow (Register -> Login -> Logout) via your terminal:

```bash
node test-api.js
```
