### Film Watchlist Backend

A minimalist Node.js + Express + Prisma backend API for managing a personal film watchlist. It supports user authentication, movie management, and watchlist tracking (planned, watching, completed, dropped).

## Tech Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express
- **ORM**: Prisma (PostgreSQL, Neon-compatible)
- **Auth**: JWT + bcrypt
- **Validation**: Zod

## Features

- **User auth**: Register, login, authenticated routes
- **Movies**: Create and list movies with metadata (genres, runtime, poster URL, etc.)
- **Watchlist**: Add movies to a user’s watchlist with status, rating, and notes
- **Data model**: `User`, `Movie`, `WatchlistItem` with unique user–movie constraint

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **PostgreSQL** database (e.g. Neon)
- **npm** (comes with Node)

### Installation

```bash
git clone <your-repo-url>
cd film-watchlist-backend
npm install
```

### Environment

Create a `.env` file in the project root and configure at least:

```bash
DATABASE_URL="postgresql://user:password@host:port/dbname"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

(Adjust keys as needed to match the existing config files.)

### Database

Run Prisma migrations and (optionally) seed movies:

```bash
npx prisma migrate deploy
npm run seed:movies
```

## Development

Start the dev server with automatic reload:

```bash
npm run dev
```

The API will be available at `http://localhost:<PORT>`.

## Scripts

- **`npm run dev`**: Start development server with `nodemon`
- **`npm run seed:movies`**: Seed initial movie data

## Endpoints

Base URL: `http://localhost:<PORT>`

- **Health**

  - `GET /health` – Simple health check, returns `ok`.

- **Auth**

  - `POST /auth/register` – Register a new user.
  - `POST /auth/login` – Login and receive a JWT.
  - `POST /auth/logout` – Logout current user (JWT invalidation handled client-side / token storage).

- **Movies**

  - `GET /movies` – List movies. **Public**.
  - `GET /movies/:id` – Get a single movie by ID. **Public**.
  - `POST /movies` – Create a new movie. **Protected** (JWT).
  - `PUT /movies/:id` – Update an existing movie. **Protected** (JWT).
  - `DELETE /movies/:id` – Delete a movie. **Protected** (JWT).

- **Watchlist** (all **Protected** – require JWT)
  - `GET /watchlist` – List current user’s watchlist items.
  - `GET /watchlist/:id` – Get a single watchlist item by ID.
  - `POST /watchlist` – Add a movie to the user’s watchlist.
  - `PUT /watchlist/:id` – Update status/rating/notes for a watchlist item.
  - `DELETE /watchlist/:id` – Remove a movie from the watchlist.

## Project Structure

- **`src/server.js`**: App entrypoint
- **`src/routes`**: Express route definitions
- **`src/controllers`**: Request handlers
- **`src/services`**: Business logic
- **`src/middleware`**: Auth & validation
- **`prisma/`**: Prisma schema, migrations, and seeds
