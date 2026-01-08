# Mannmitra – Mental Health Support Platform

Mannmitra is a comprehensive mental health support platform that provides AI-powered chatbot assistance, journaling, assessments, community features, and relaxation audio. The project ships with a fully themed React experience (Tailwind + shadcn/ui) plus a production-ready Node.js/Express backend that handles JWT auth, MongoDB persistence, and Google Gemini integration.

## ✨ Feature Highlights
- Unified dashboard with progress tracking, assessment results, and personalized recommendations.
- Dedicated pages for chatbot, diary, assessments, community, classes, and relaxation audio.
- Auth flow with signup/login, JWT tokens, protected routes, and secure API endpoints.
- AI chatbot powered by Google Gemini for conversational support.
- Community features for peer support and discussions.
- Rewards system with gamification elements.
- File upload support for audio and user-generated content.
- Responsive design with Tailwind CSS and shadcn/ui components.

## 🧱 Tech Stack
| Layer      | Technologies                                                                 |
| ---------- | ----------------------------------------------------------------------------- |
| Frontend   | React, Vite, JavaScript (JSX), Tailwind + shadcn/ui, Axios, React Router      |
| Backend    | Node.js, Express.js, MongoDB, Mongoose, JWT, Multer                          |
| AI & Tools | Google Gemini API, Axios, Multer for uploads                                 |

## 📁 Project Structure
```
mannmitra/
├── client/
│   ├── src/
│   │   ├── api/           # Axios client and API functions
│   │   ├── components/    # UI components (Header, Footer, etc.)
│   │   ├── contexts/      # AuthContext for state management
│   │   ├── lib/           # Utilities (utils.js)
│   │   ├── pages/         # Route-level components (Home, Login, Dashboard, etc.)
│   │   ├── services/      # API service functions
│   │   └── utils/         # Additional helpers
│   ├── public/            # Static assets
│   └── package.json
├── server/
│   ├── config/           # Database connection
│   ├── controllers/      # Business logic handlers
│   ├── middlewares/      # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── seeds/            # Data seeding scripts
│   ├── uploads/          # File upload directory
│   ├── utils/            # Helpers (Gemini integration, recommendations)
│   └── server.js         # Express entrypoint
├── vercel.json           # Deployment config
└── docs/
    └── ARCHITECTURE.md   # Architectural notes
```

## ⚙️ Prerequisites
- Node.js ≥ 16
- MongoDB
- npm or yarn

## 🔐 Environment Variables
Copy and adjust for your environment:

Backend (`server/.env`):
- `PORT=3000`
- `MONGODB_URI=mongodb://localhost:27017/mannmitra`
- `JWT_SECRET=super-secret-string`
- `GEMINI_API_KEY=your-gemini-api-key`
- Payment API keys if applicable

Frontend (`client/.env`):
- `VITE_API_URL=http://localhost:3000/api`

- For More Details Visit Our .env.sample File in Client and Server Folder

## 🚀 Getting Started
### 1. Backend
```bash
cd server
npm install
npm run seed  # optional: seed initial data
npm run build   # starts server on port 3000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

## 🧪 Example API Calls
```http
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get user progress
GET /api/progress
Authorization: Bearer <jwt-token>
```

Response excerpt:
```json
{
  "userId": "user123",
  "assessmentsCompleted": 5,
  "diaryEntries": 20,
  "chatSessions": 15,
  "lastUpdated": "2025-12-19T10:00:00Z"
}
```

## 🛡️ Security & Integrations
- JWT tokens for authentication, stored securely in client.
- Protected routes via auth middleware.
- File uploads handled securely with Multer.
- Google Gemini integration for AI chatbot responses.
- MongoDB for flexible data storage.

## 🧭 Additional Docs
- See `ARCHITECTURE.md` for diagrams, module breakdowns, and deployment notes.

---
Happy supporting mental health! 🌟
