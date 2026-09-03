# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

# Grace House Airbnb Clone

React/Vite frontend with an Express/Mongoose API for South African stays.

## Run locally

```bash
npm install
npm run dev:all
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`.
Copy the required values into `server/.env`. `MONGO_URI` is optional during local development; the API uses an in-memory fallback store when MongoDB is unavailable. `TAPLINE_API_KEY` is kept server-side and is never sent to the browser.

## Accounts

- Guests sign up and sign in at `/register` and `/login`.
- Hosts sign up and sign in at `/admin/register` and `/admin/login`.
- The seeded host account is configured by the server seed scripts.

Host listing mutations and reservations are protected with JWT middleware. Listings are scoped to their owner, and bookings are associated with the authenticated guest and host.

## Useful commands

```bash
npm run build
npm run lint
npm run db:seed:user
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
