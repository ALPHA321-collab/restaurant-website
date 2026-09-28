# Angithi: restaurant website

Full-stack restaurant site. Frontend is plain HTML, CSS and JavaScript. Backend is Node.js with Express, storing data in JSON files.

## Features
- Menu loaded from the API, filtered by category
- Table booking form with server-side validation
- Contact form
- Admin endpoints to view bookings and messages

## Run locally
```bash
npm install
ADMIN_KEY=your-secret npm start
```
Open http://localhost:3000

## API
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/menu` | Menu items |
| POST | `/api/reservations` | Create booking |
| POST | `/api/contact` | Send message |
| GET | `/api/admin/reservations` | List bookings (header `x-admin-key`) |
| GET | `/api/admin/messages` | List messages (header `x-admin-key`) |

Edit `data/menu.json` to change the menu.

## Upload to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/angithi-restaurant.git
git push -u origin main
```

## Deploy
GitHub Pages only hosts static files, so the backend will not run there. Deploy the whole repo to Render, Railway or Fly.io (start command: `npm start`, set `ADMIN_KEY`). Note that free hosts may reset JSON files on restart; move to a database such as SQLite or MongoDB for production.
