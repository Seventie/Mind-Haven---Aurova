# Mind Haven - Empathetic Mental Health Support

Mind Haven is a comprehensive mental health platform designed specifically for women and youth. It combines cutting-edge AI technology with a human-centric, neo-brutalist design to provide a safe, anonymous, and supportive environment for emotional wellness.

## 🌟 Vision
To de-stigmatize mental health care by providing accessible, AI-powered tools and connecting users with verified specialists in a vibrant, engaging experience.

## 🏗 System Design

### Architecture Overview
Mind Haven follows a modern Client-Server architecture:
- **Frontend**: A highly interactive React application using TypeScript for type safety and Tailwind CSS for its unique Neo-Brutalist aesthetic.
- **Backend**: A robust Node.js/Express server handling authentication, data persistence, and orchestration between different services.
- **Database**: MongoDB (Atlas) for storing user profiles, journal entries, chat logs, and specialist metadata.
- **AI Engine**: Integration with Google Gemini for real-time emotional analysis and empathetic chat interactions.
- **Microservices**: A Python-based embedding service for advanced semantic search and memory retrieval.

### Key Components
1. **AI Journaling (Cognitive Lab)**: Analyzes user entries to detect mood trends and provide empathetic feedback.
2. **Empathetic Chat**: An AI-integrated 24/7 listener for immediate support.
3. **Standard & Incognito Accounts**: A dual-identity system allowing users to seek help either professionally or anonymously.
4. **Specialist Network**: A dedicated dashboard for doctors to manage consultations and a directory for users to find help.
5. **Community Circles**: Safe spaces for peer support.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide/Material Icons.
- **Backend**: Node.js, Express, Mongoose.
- **AI/ML**: Google Gemini API, Python (Sentence Transformers/Embeddings).
- **Auth**: Firebase Authentication with JWT-based session management.
- **Styling**: Neo-Brutalist design system with custom shadow utilities.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Google Gemini API Key
- Firebase Project for Authentication

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Seventie/Mind-Haven.git
   ```
2. Install dependencies:
   ```bash
   # Root (Frontend)
   npm install
   # Server (Backend)
   cd server
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `server` directory and add:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_key
   ```
4. Start the servers:
   ```bash
   # Terminal 1: Backend
   cd server
   npm start
   
   # Terminal 2: Frontend
   cd ..
   npm run dev
   ```

---
Contact: [Seventie](https://github.com/Seventie)
