# LimeBuyer - Backend

A RESTful API for a map based citrus reviewing platform. Users can:

- Search for stores by location
- See reviews associated with each store
- Login and Signup with and without gmail
- Post Reviews on stores
- Delete reviews they've made
- Edit their username and profile picture

🟢 Live API - https://limebuyer2025-be-fug6.onrender.com

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Jest & Supertest
- Jest-extended
- Husky for Git hooks
- CORS middleware for cross-origin requests
- Firebase and Firebase Admin
- PG and PG-Format
- Nodemon

## Setup

1. Clone repository:

```bash
git clone https://github.com/cnorman2000/LimeBuyer2025_BE.git
```

2. Install dependencies:

```bash
npm install
```

3. Environment variables
   Create the following .env files in the root of the project

- .env.development
- .env.test
- .env.production
- .env

```bash
# .env.development
PGDATABASE=lime_buyer
```

```bash
# .env.test
PGDATABASE=lime_buyer_test
```

```bash
# .env.production
DATABASE_URL=your_production_database_url_here
```

```bash
# .env
FIREBASE_SERVICE_ACCOUNT=firebase_service_account
```

4. Set up databases:

```bash
npm run setup-dbs
```

5. Seed databases

- For development / testing:

```bash
npm run seed
```

- For production:

```bash
npm run seed-prod
```

6. Run tests:

```bash
npm test
```
