# React + Vite

React/Vite frontend with an Express/Mongoose API for South African stays.
## Run locally

```bash
npm install
npm run dev:all
```

Currently, two official plugins are available:


## React Compiler

- Admins sign in at `/admin/control/login`.
# Grace House Airbnb Clone

React/Vite frontend with an Express/Mongoose API for South African stays.

## Run locally

```bash
npm install
npm run dev:all
```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`.
Set the required values in `server/.env`. `MONGO_URI` is optional during local development; the API uses fallback storage when MongoDB is unavailable. `TAPLINE_API_KEY` remains server-side.

## Demo accounts

| Role | Login route | Email | Password |
| --- | --- | --- | --- |
| Guest | `/login` | `guest@gracehouse.co.za` | `Guest123!` |
| Host | `/admin/login` | `koketsomaake295@gmail.com` | `Kmaake0616368479$` |
| Admin | `/admin/control/login` | `admin@gracehouse.co.za` | `Admin123!` |

Guests can make reservations and view their own reservations. Hosts manage their own listings and reservations. Admins manage the entire platform.

## Useful commands

```bash
npm run build
npm run lint
npm run db:seed:user
```
npm run build
