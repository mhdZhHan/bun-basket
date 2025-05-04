# 🛍️ Bun Basket

A lightweight, secure, and scalable REST API for managing products, built with **Express**, **TypeScript**, and **Bun**. It includes a powerful migration script, input validation, and structured logging out of the box.

## 🚀 Features

- 🧱 Type-safe environment config using Zod
- 🔐 Security with Helmet
- 🧾 Structured logging via Pino
- ✅ Request validation with Zod schemas
- ⚡ Ultra-lightweight SQL queries using `bun-sql`
- 📦 Products CRUD API
- 🧙‍♂️ Superpowered `migrate.ts` for handling database migrations (with advisory locks!)

## 🔧 Setup

1. **Clone the repo**

```bash
git clone https://github.com/mhdZhHan/bun-basket
cd bun-basket
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up environment variables**
   Create a `.env` file based on `env.ts` schema:

```env
DATABASE_URL=
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
ARCJET_KEY=
ARCJET_ENV=
```

4. **Run migrations**

```bash
bun run migrate.ts up
```

5. **Start the server**

```bash
bun run index.ts
```

## 🧙 Migrations

This project includes a custom migration system:

- `bun run migrate.ts up` – Apply new migrations
- `bun run migrate.ts down` – Rollback applied migrations
- Uses **PostgreSQL advisory locks** to prevent race conditions
- Tracks executed migrations in a custom table

Migration files live in:

```bash
server/db/migrations/
```

## ✅ Example Request

```bash
curl http://localhost:8080/api/products
```
