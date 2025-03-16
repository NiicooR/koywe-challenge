# Currency Exchange API

A NestJS API for converting between fiat and cryptocurrencies. This project allows users to create and retrieve currency quotes with real-time exchange rates.

# Related Projects

This API has a companion frontend project that provides a user interface for the currency exchange functionality:

- [Currency Exchange UI](https://github.com/NiicooR/koywe-challenge-ui) - Next.js frontend application for interacting with this API

## Prerequisites

- Node.js (v16 or higher)
- npm
- Docker and Docker Compose
- Git

## Setup and Installation

### 1. Clone the repository

```bash
git clone [repository-url]
cd koywe-challenge
```

### 2. Set up environment variables

Create a `.env` file in the project root based on the example:

```bash
# Database connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/currency_exchange?schema=public"

# Server configuration
PORT=3001
NODE_ENV=development

# JWT authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1h

# External API
CRYPTOMKT_API_URL=https://api.exchange.cryptomkt.com/api/3/public/price/rate
```

### 3. Start the database with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL database container on port 5432.

### 4. Install dependencies

```bash
npm install
```

### 5. Database setup with Prisma

To set up the database schema and generate the Prisma client:

```bash
npx prisma migrate dev
```

### 6. Start the application

```bash
npm run start:dev
```

The API will be available at http://localhost:3001

## Testing

```bash
# Run unit tests only
npm run test:unit

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login to get JWT token

### Quotes

- `POST /quote` - Create a new currency quote
- `GET /quote/:id` - Get a quote by its ID

## Testing the API

The project includes a `requests.http` file in the root directory that you can use with the VS Code Rest Client extension to test the API endpoints. Simply open the file and click on the "Send Request" link above each request to execute it.

## Example Usage

### Registration

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Quote (with authentication)

```bash
curl -X POST http://localhost:3001/quote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000000,
    "from": "ARS",
    "to": "ETH"
  }'
```

### Get Quote by ID (with authentication)

```bash
curl -X GET http://localhost:3001/quote/QUOTE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

- `src/auth`: Authentication module (JWT implementation)
- `src/quotes`: Quote module for currency conversion
- `src/providers`: External API providers
- `src/database`: Database configuration and services
- `src/config`: Application configuration

## Tech Stack

- NestJS framework
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Docker for containerization


## AI Assistance
This project was developed with the assistance of Claude AI by Anthropic. Claude was used to help with:

Generating boilerplate code for common patterns
Implementing best practices for NestJS architecture
Creating unit and e2e tests
Structuring the project according to NestJS conventions
Writing documentation

Using AI assistance allowed for optimizing development time by automating repetitive coding tasks while maintaining high code quality and following established patterns.