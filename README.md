# Simple Lead Management

A full-stack lead management app with a **Next.js frontend** and **Node.js/Express + MongoDB backend**.

## Features
- Create, edit, and delete leads
- Update lead status
- View all leads in a table
- Status color badges and formatted dates
- Modal dialogs for create/edit/delete confirmation

## Tech Stack
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Express, Mongoose, Zod
- Database: MongoDB

## Quick Start

### 1) Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2) Configure environment

Frontend uses:
- `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000`)

Backend uses your MongoDB connection config in its environment setup.

### 3) Run the app

```bash
# Terminal 1 (backend)
cd backend
npm run dev

# Terminal 2 (frontend)
cd frontend
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## API Routes (Backend)

Base URL: `http://localhost:5000`

### Health
- `GET /health`  
  Returns server health response.

### Leads
- `GET /leads`  
  Fetch all leads (newest first).

- `POST /leads`  
  Create a new lead.

- `PATCH /leads/:id`  
  Update lead fields (`name`, `email`, `status`).

- `PATCH /leads/:id/status`  
  Update only lead status.

- `DELETE /leads/:id`  
  Delete a lead.

## Notes
- If you see Next.js `.next` `EINVAL readlink` errors on Windows + OneDrive, keep project files fully local (or move out of OneDrive sync) and prefer Node 18/20 LTS for Next 14.
