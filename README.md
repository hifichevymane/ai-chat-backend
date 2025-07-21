# AI Chat Backend

## Main Technologies Used

- [**Node.js** (v22.x)](https://nodejs.org/)
- [**TypeScript**](https://www.typescriptlang.org/)
- [**pnpm** (package manager)](https://pnpm.io/)
- [**PostgreSQL**](https://www.postgresql.org/)
- [**Ollama** (LLM integration)](https://ollama.com/)
- [**Docker & Docker Compose**](https://www.docker.com/)
- [**Express.js**](https://expressjs.com/)
- [**Prisma ORM**](https://www.prisma.io/)
- [**ESLint & Prettier** (code quality)](https://eslint.org/) ([Prettier](https://prettier.io/))
- [**nginx**](https://nginx.org/) - Used in Production Docker container
- [**Vitest**](https://vitest.dev/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd ai-chat-backend
```

### 2. Install dependencies

Make sure you have [pnpm](https://pnpm.io/) installed:

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
APP_PORT=<port that will used to start the server>
FRONTEND_ALLOWED_URL=<frontend app allowed url>

OLLAMA_HOST=<host where ollama server will run>
OLLAMA_PORT=<port where ollama server will run>
MODEL_ID=<ollama llm model id>

DB_NAME=<database name>
DB_USER=<database user name>
DB_PASSWORD=<database user password>
DB_PORT=<database port>
DATABASE_URL=<database connection string for ORM>
```

Adjust values as needed for your setup.

By default the values are:

```env
APP_PORT=3000
FRONTEND_ALLOWED_URL=http://localhost:5173

OLLAMA_HOST=ollama
OLLAMA_PORT=11434
MODEL_ID=llama3.2:latest

DB_NAME=ai_chat
DB_USER=postgres
DB_PASSWORD=12345
DB_PORT=5432
DATABASE_URL="postgresql://postgres:12345@postgres-db:5432/ai_chat?schema=public"
```

### 4. Start the Ollama server

Make sure you have [Ollama](https://ollama.com/) installed locally. In a separate terminal, run:

```bash
ollama serve
```

This will start the Ollama LLM server required by the backend.

### 5. Set up the database

Make sure you have PostgreSQL running and the credentials match your `.env` file.
Run migrations and generate Prisma client:

```bash
pnpm db:migrate:dev
```

### 6. Seed the database

```bash
pnpm db:seed
```

### 7. Start the application

```bash
pnpm dev
```

The server will start on `http://localhost:3000` by default.

### 7. Run [Prisma Studio Web UI](https://www.prisma.io/docs/orm/tools/prisma-studio)

```bash
pnpm prisma-studio
```

### 8. Run tests

```bash
pnpm test
```

or

```bash
pnpm test:watch
```

---

## Running with Docker in Development mode

### 1. Build and start all services

```bash
pnpm docker:dev
```

This will start:

- The backend app
- PostgreSQL database
- Ollama LLM service
- Prisma Studio Web UI

Ports will be gotten from `.env` file

### 2. Environment variables

Docker Compose will use the `.env` file in the root directory. Make sure it is set up as described above.

### 3. Access

- API: `http://localhost:3000/api`
- Health check: `http://localhost:3000/api/health-check`

---

## Running with Docker in Production mode

### 1. Build and start all services

```bash
pnpm docker:prod
```

This will start:

- nginx server gateway
- The backend app
- PostgreSQL database
- Ollama LLM service

Ports will be gotten from `.env` file

### 2. Environment variables

Docker Compose will use the `.env` file in the root directory. Make sure it is set up as described above.

### 3. Access

- API: `http://localhost:80/api`
- Health check: `http://localhost:80/api/health-check`

---

## Useful Scripts

- `pnpm start` - Start the backend in production mode
- `pnpm dev` — Start the backend in development mode
- `pnpm db:migrate:dev` — Run database migrations and generate Prisma client in Development environment
- `pnpm db:migrate:prod` - Run database migrations and generate Prisma client in Production environment
- `pnpm db:seed` - Run seed script to populate the database
- `pnpm lint` — Lint the codebase
- `pnpm format` — Format the codebase
- `pnpm prisma-studio` - Run Prisma Studio Web UI to inspect models in the database
- `pnpm docker:dev` - Run development Docker container
- `pnpm docker:prod` - Run production Docker container
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in the watch mode

---
