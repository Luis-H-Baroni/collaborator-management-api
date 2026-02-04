# Collaborators API

REST API for collaborator management with database persistence and external API consumption.

## Technologies

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Testing:** Jest, Supertest
- **Documentation:** Swagger/OpenAPI
- **External API:** JSONPlaceholder (https://jsonplaceholder.typicode.com/users)
- **Docker:** Docker & Docker Compose

## Installation

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (or use Docker)
- npm or yarn

### Step 1: Clone the repository

```bash
git clone https://github.com/Luis-H-Baroni/collaborator-management-api.git
cd collaborator-management-api
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment variables

Copy the `.env.example` file to `.env` and configure the variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configurations:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=teste_backend
```

### Step 4: Run the database

#### Option A: Use Docker Compose (Recommended)

```bash
npm run docker:up
```

This will start PostgreSQL in a Docker container.

#### Option B: Local PostgreSQL

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE teste_backend;
```

### Step 5: Run migrations or seed

To populate the database with initial data:

```bash
npm run seed
```

This will import collaborators from the external API (JSONPlaceholder).

## Execution

### Development

```bash
npm run dev
```

The API will be available at http://localhost:3000

### Production

```bash
npm run build
npm start
```

### Docker

```bash
npm run docker:up
```

The application and PostgreSQL will be running in containers.

## Available Scripts

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Starts server in development mode with hot-reload |
| `npm run build`         | Compiles TypeScript to JavaScript                 |
| `npm start`             | Starts server in production mode                  |
| `npm test`              | Runs tests                                        |
| `npm run test:watch`    | Runs tests in watch mode                          |
| `npm run test:coverage` | Runs tests with coverage report                   |
| `npm run lint`          | Runs ESLint                                       |
| `npm run format`        | Formats code with Prettier                        |
| `npm run docker:up`     | Starts Docker containers (app + postgres)         |
| `npm run docker:down`   | Stops Docker containers                           |
| `npm run docker:logs`   | View Docker container logs                        |
| `npm run seed`          | Populates database with initial data              |

## API Endpoints

### Documentation

The complete API documentation is available via Swagger UI:

http://localhost:3000/api-docs

### Endpoints

#### Health Check

```http
GET /collaborators/health
```

Checks if the API is running.

**Response:**

```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### Import Collaborators

```http
POST /collaborators/import
```

Imports collaborators from the external API (JSONPlaceholder).

**Response:**

```json
{
  "imported": 8,
  "ignored": 2
}
```

#### List Collaborators

```http
GET /collaborators?page=1&limit=10&search=joao&sort=name&order=asc
```

Lists collaborators with pagination, filtering, and sorting.

**Query Parameters:**

- `page`: Current page (default: 1, minimum: 1)
- `limit`: Items per page (default: 10, range: 1-100)
- `search`: Filter by name (case-insensitive)
- `sort`: Field for sorting (default: createdAt)
- `order`: Sort direction: asc or desc (default: desc)

**Validation:**

- `page` must be a positive integer (>= 1)
- `limit` must be an integer between 1 and 100

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Collaborator Name",
      "email": "email@example.com",
      "city": "City",
      "company": "Company",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Get Collaborator by ID

```http
GET /collaborators/:id
```

Returns a specific collaborator by UUID.

**Response:**

```json
{
  "id": "uuid",
  "name": "Collaborator Name",
  "email": "email@example.com",
  "city": "City",
  "company": "Company",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Delete Collaborator

```http
DELETE /collaborators/:id
```

Removes a collaborator by UUID.

**Response:** 204 No Content

## Error Handling

The API returns the following HTTP status codes:

- `200` - Success
- `204` - Success without content (DELETE)
- `400` - Bad request (validation, duplicate email)
- `404` - Record not found
- `500` - Internal server error

**Error Format:**

```json
{
  "error": "Error message"
}
```

**Error 400 Examples (Validation):**

```json
{
  "error": "Page must be a positive integer"
}
```

```json
{
  "error": "Limit must be a positive integer between 1 and 100"
}
```

**Error 404 Example (Not found):**

```json
{
  "error": "Collaborator not found"
}
```

## Tests

To run the tests:

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with code coverage
npm run test:coverage
```

## Project Structure

```
src/
├── config/
│   ├── database.ts       # Sequelize configuration
│   ├── env.ts           # Environment variables
│   └── swagger.ts       # Swagger configuration
├── collaborators/
│   ├── controllers/      # HTTP controllers
│   ├── dto/             # Data Transfer Objects
│   ├── models/          # Sequelize models
│   ├── repositories/    # Database access
│   ├── routes/          # Express route definitions
│   └── services/        # Business logic and integrations
├── shared/
│   ├── middleware/      # Global middleware (error handling)
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Utilities (logger)
├── scripts/
│   └── seed.ts          # Database seed script
├── app.ts               # Express configuration
├── server.ts            # HTTP server
└── index.ts             # Entry point
```

## Docker

### Docker Files

- `Dockerfile` - Application image
- `docker-compose.yml` - Service orchestration (app + postgres)

### Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs
```

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

Formats all code with Prettier using configurations in `.prettierrc`.

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript. The compiled code will be in the `dist/` folder.
