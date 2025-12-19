# Mann Mitra Architecture

Mann Mitra is a full-stack mental health platform that provides AI-powered chatbot support, diary tracking, assessments, community features, and relaxation audio. The system is split into a Node.js/Express backend and a React + Vite frontend.

---

## High-Level Overview

```
┌─────────────┐        ┌───────────────┐        ┌─────────────┐
│   Frontend  │ <────> │    Backend    │ <────> │   External  │
│  React App  │  HTTPS │ Node.js/Express│  APIs │  Services   │
└─────────────┘        └───────────────┘        └─────────────┘
       │                        │                       │
       │                        │                       │
╔══════╧══════╗       ╔═════════╧════════╗      ╔═══════╧═══════╗
║ React +     ║       ║ MongoDB +        ║      ║  Google Gemini║
║ Vite +      ║       ║ Express +        ║      ║  Payment APIs ║
║ Tailwind    ║       ║ JWT Auth +       ║      ║  Audio APIs   ║
║ shadcn/ui   ║       ║ Multer for Uploads║      ╚══════════════╝
╚═════════════╝       ╚═══════════════════╝
```

- **Frontend**: React + Vite + Tailwind + shadcn/ui. Uses React Router for routing, Axios for API calls, AuthContext for authentication state. Provides responsive UI, authentication forms, dashboard, chatbot, diary, assessments, community, and rewards pages.
- **Backend**: Node.js with Express.js, modular structure. Provides JWT authentication, API endpoints for chat, diary, assessments, community, payments, and user progress. Integrates with Google Gemini for AI responses, handles file uploads for audio, and manages user data.
- **Database**: MongoDB with Mongoose ODM. Core entities: `User`, `Diary`, `MentalHealthReport`, `Community`, `RelaxationAudio`, `UserProgress`, `Class`.
- **External Services**: Google Gemini API for AI chatbot, payment gateways for rewards/upgrades, audio hosting services.

---

## Backend Modules

```
server/
  config/        # database connection
  controllers/   # business logic handlers
  middlewares/   # auth middleware
  models/        # Mongoose schemas
  routes/        # API route definitions
  seeds/         # data seeding scripts
  uploads/       # file upload directory
  utils/         # helpers (Gemini integration, recommendations)
  server.js      # Express entrypoint
```

- `config/db.js`: MongoDB connection setup.
- `middlewares/auth.middleware.js`: JWT verification for protected routes.
- `models/`: User, Diary, MentalHealthReport, Community, RelaxationAudio, UserProgress, Class schemas.
- `controllers/`: Handlers for auth, chat, classes, community, diary, mental health reports, payments, relaxation audio, user progress.
- `routes/`: Route definitions for each feature, grouped by domain.
- `utils/gemini.js`: Integration with Google Gemini API for AI responses.
- `utils/recommendation.js`: Logic for personalized recommendations.
- `seeds/`: Scripts to seed audio and classes data.
- `server.js`: Main Express app setup, middleware, and route mounting.

### Authentication Flow
1. User registers/logs in via `/auth/register` or `/auth/login`.
2. Backend validates credentials, issues JWT token.
3. Token stored in client (localStorage), sent in headers for protected requests.
4. Middleware verifies token on protected routes.

### AI Integration
- Chatbot uses Google Gemini API for responses.
- Recommendations based on user progress and assessments.

### File Uploads
- Multer handles audio file uploads for relaxation features.
- Files stored in `uploads/` directory.

---

## Frontend Modules

```
client/src/
  api/             # Axios client and API functions
  components/      # shared UI components (Header, Footer, etc.)
  contexts/        # AuthContext for state management
  lib/             # utilities (utils.js)
  pages/           # route-level components (Home, Login, Dashboard, etc.)
  services/        # API service functions
  utils/           # additional helpers
  App.jsx          # main app component
  main.jsx         # entry point
```

- Tailwind + shadcn/ui for styling and components.
- React Router for navigation.
- Axios for API calls, with interceptors for auth.
- AuthContext manages user authentication state.
- Pages include Home, Login, Register, Dashboard, Chatbot, Diary, Assessment, Community, Classes, Rewards, etc.

### Routing
- `/` (Home)
- `/login`, `/register`
- `/dashboard`
- `/chatbot`
- `/diary`
- `/assessment`
- `/community`
- `/classes`
- `/rewards`
- `/audio`
- Protected routes require authentication.

### State Management
- `AuthContext`: Handles user login, logout, token storage.

### Data Flow
1. Auth pages call API for login/register, update context.
2. Protected pages fetch data via API calls.
3. Chatbot interacts with backend AI endpoint.

---

## External Services

- **Google Gemini**: For AI-powered chatbot responses.
- **Payment Gateways**: For handling rewards and upgrades (e.g., Stripe or similar).
- **Audio Hosting**: For storing and serving relaxation audio files.

---

## Environment Variables

- Backend `.env`:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `GEMINI_API_KEY`
  - `PAYMENT_API_KEY`
  - `PORT`

- Frontend `.env`:
  - `VITE_API_URL`
  - `VITE_GEMINI_API_KEY` (if needed)

---

## Deployment Considerations

- Containerize Node.js backend and React frontend.
- Use HTTPS, secure environment variables.
- Deploy to platforms like Vercel (for frontend) and Heroku/AWS (for backend).
- Add logging, monitoring, and error handling.
- Ensure compliance with mental health data privacy regulations.

---

This architecture document informs the implementation across client and server folders.
