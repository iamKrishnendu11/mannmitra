# Mannmitra

Mannmitra is a comprehensive mental health support platform designed to provide users with tools for self-assessment, journaling, relaxation audio, community support, and AI-powered chatbot assistance. The application aims to promote mental well-being through personalized experiences and accessible resources.

## Features

- **User Authentication**: Secure login and registration system
- **Mental Health Assessment**: Interactive assessments to evaluate mental health status
- **Diary/Journaling**: Private space for users to record thoughts and reflections
- **Relaxation Audio**: Curated audio sessions for stress relief and mindfulness
- **AI Chatbot**: Powered by Gemini AI for conversational support and guidance
- **Community**: Connect with others for peer support and discussions
- **Classes**: Educational content and workshops on mental health topics
- **Rewards System**: Gamification elements to encourage positive habits
- **Progress Tracking**: Monitor personal growth and mental health improvements
- **Payment Integration**: Support for premium features and services

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern UI components built on Radix UI and Tailwind CSS

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **JWT**: JSON Web Tokens for authentication

### AI & Utilities
- **Google Gemini**: AI model for chatbot functionality
- **Multer**: Middleware for handling file uploads

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mannmitra
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `server` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   # Add other required environment variables
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   npm run seed
   ```

## Usage

### Development

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173` (client) and the server will run on `http://localhost:5000`.

### Production

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## Project Structure

```
mannmitra/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utils/            # Utility functions
│   ├── seeds/            # Database seed files
│   └── package.json
└── vercel.json            # Vercel deployment configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress` - Update user progress

### Chat
- `POST /api/chat` - Send message to AI chatbot

### Classes
- `GET /api/classes` - Get available classes
- `POST /api/classes/enroll` - Enroll in a class

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create a new post

### Diary
- `GET /api/diary` - Get user's diary entries
- `POST /api/diary` - Create a new diary entry

### Audio
- `GET /api/audio` - Get relaxation audio files
- `POST /api/audio/upload` - Upload new audio file

### Mental Health Reports
- `GET /api/reports` - Get mental health reports
- `POST /api/reports` - Generate new report

### Payment
- `POST /api/payment` - Process payment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- Google Gemini for AI capabilities
- shadcn/ui for beautiful UI components
- The open-source community for various libraries and tools used in this project
