# Deployment & Integration Guide (Home PC / Production)

This guide is designed for the agent or developer setting up the **Painel 162** project in a new environment (e.g., Home PC with full infrastructure).

## Project Overview
- **Backend**: Node.js, Express, MySQL (mocked via Docker), JWT.
- **Frontend**: React, Vite, TailwindCSS, Framer Motion.
- **Database**: MySQL 5.7 (Dockerized).

## Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

## Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/code-bynary/painel-162.git
cd painel-162

# Install Backend Dependencies
cd backend
npm install
cd ..

# Install Frontend Dependencies
cd frontend
npm install
cd ..
```

### 2. Database Setup (Docker)
The project uses a localized MySQL container.
```bash
# In the project root
docker-compose up -d --build
```
*Note: This utilizes `scripts/init.sql` to create `pw_auth`, `pw_users`, and mock tables (`characters`, `donate_packages`).*

### 3. Environment Variables
Ensure `backend/.env` is configured (it should be committed or created based on `.env.example`).
```env
PORT=3000
DB_HOST=mysql
DB_USER=root
DB_PASS=root
DB_NAME_AUTH=pw_auth
DB_NAME_USERS=pw_users
JWT_SECRET=supersecret
```

### 4. Running the Application
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Production / Real Infrastructure Integration

To switch from **Mock Data** to **Real Perfect World Server**:

### 1. Database Connection
Modify `backend/.env` to point to your real PW database (SQL Server or Linux MySQL).
*   **Important**: PW usually uses MSSQL or strict MySQL versions. Ensure the `mysql2` driver is compatible, or switch to `mssql` (tedious) if using MSSQL.
*   **Current Mock**: We use MySQL 5.7.

### 2. Character Data (`characters` table)
The current `Get Characters` endpoint queries a local `characters` table.
*   **Real Integration**: You must query the `pointbucket` or the Game DB (`gamedbd`) which is complex.
*   **Alternative**: Sync `p_roles` to a MySQL table periodically if you cannot query the game DB directly from Node.

### 3. Donations (`donate_controller.ts`)
The current payment flow is a **MOCK**.
*   **To go Live**:
    1.  Integrate a real gateway (MercadoPago, Stripe, PayPal).
    2.  Update `createPayment` to call the gateway API.
    3.  Update `webhook` to verify the real signature.
    4.  **Delivery**: Instead of just updating the status, you must trigger the **Gold Delivery**.
        *   *Option A*: Insert into `usecashnow` table (if supported).
        *   *Option B*: Use `gdeliveryd` console commands via a socket connection (requires a C++ bridge or specific Node packet sender).

## Troubleshooting
- **Docker**: If ports 3306 are occupied, change `docker-compose.yml`.
- **CORS**: Check `backend/src/server.ts` if frontend cannot talk to backend on different IPs.
