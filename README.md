# 🔧 FixIt — Repair Shop Booking Manager

A full-stack mobile web app for managing repair shop clients and repair jobs.

## Tech Stack
- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express + SQLite
- **Styling:** Inline React styles

---

## 📁 Project Structure

```
fixit/
├── backend/
│   ├── server.js         # Express API
│   ├── package.json
│   └── fixit.db          # SQLite database (auto-created)
└── frontend/
    └── src/
        ├── App.tsx
        ├── components/
        │   └── Navbar.tsx
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── ClientProfile.tsx
        │   └── RepairHistory.tsx
        └── services/
            └── api.ts
```

---

## ▶️ Running the App

### Backend
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs at http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers/` | Get all clients |
| POST | `/customers/` | Register a new client |
| PUT | `/customers/:id` | Update a client |
| DELETE | `/customers/:id` | Delete a client |
| GET | `/orders/:customerId` | Get repairs for a client |
| POST | `/orders/:customerId` | Add a repair |
| PUT | `/orders/:id` | Update a repair |
| DELETE | `/orders/:id` | Delete a repair |

---

## 🌿 Git Workflow

### Initial Setup
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/fixit.git
git add .
git commit -m "initial commit: project setup"
git push -u origin main
```

### Feature Branch Workflow (follow this every time)
```bash
# 1. Create a new feature branch
git checkout -b feature/client-profile

# 2. Make your changes, then stage and commit
git add .
git commit -m "feat: add client registration form"

# Keep committing as you work (aim for 5-10 commits total)
git commit -m "feat: add client edit functionality"
git commit -m "feat: add client delete with confirmation"

# 3. Push your branch to GitHub
git push origin feature/client-profile

# 4. Go to GitHub → open a Pull Request from your branch into main
# 5. Review and merge the PR on GitHub
# 6. Switch back to main and pull the latest
git checkout main
git pull origin main
```

### Suggested Branches & PRs

| Branch | What to commit |
|--------|---------------|
| `feature/client-profile` | ClientProfile.tsx, Navbar.tsx |
| `feature/dashboard` | Dashboard.tsx |
| `feature/repair-history` | RepairHistory.tsx |
| `feature/backend-api` | server.js, package.json |
| `feature/styling` | Any UI improvements |

---

## ✅ Requirements Checklist

- [x] Node.js API (Express)
- [x] 4+ endpoints (8 total)
- [x] React frontend
- [x] 3 pages (Dashboard, ClientProfile, RepairHistory)
- [x] ES6 arrow functions, destructuring, modules
- [x] TypeScript used throughout frontend
- [x] Git + GitHub workflow
- [x] No direct push to main
- [x] Feature branches (feature/*)
- [x] All work via Pull Requests
