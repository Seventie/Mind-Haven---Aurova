# Aurova (Mind Haven) – Digital Mental Health Access for Women & Youth

Aurova is a privacy-first mental health support platform designed for women and youth who want help without exposing their identity. The platform connects patients, licensed professionals, and anonymous peers in one safe environment for journaling, empathetic AI support, and consent-based care. It is built to reduce stigma, offer early emotional support, and provide clinical insights only when users choose to share them.

## Table of Contents
- [Mission & Problem Statement](#mission--problem-statement)
- [What Aurova Delivers](#what-aurova-delivers)
- [Core Use Cases](#core-use-cases)
- [Clinical Significance & Safety](#clinical-significance--safety)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Tech Stack Icons](#tech-stack-icons)
- [Module Overview](#module-overview)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Contributors](#contributors)

## Mission & Problem Statement
Women and youth often delay or avoid mental health support because of stigma, fear of judgment, and lack of privacy. Aurova provides an anonymous-first experience where users can share emotions, receive empathetic guidance, and connect to professionals when they are ready, all while retaining control over their identity and data.

## What Aurova Delivers
- **Anonymous onboarding with consent controls** for identity-sharing and data access.
- **Private journaling** with AI-powered emotional analysis and trend tracking.
- **Empathetic AI assistant** for check-ins, reflection prompts, and supportive responses.
- **Professional booking & doctor dashboards** with pre-/post-therapy insights.
- **Threat detection & safety alerts** for high-risk content in journals or chats.
- **Community circles** for private peer support around similar challenges.
- **Wellness guidance** including medically informed yoga practices and coping routines.
- **Emergency contact guidance** to quickly route help when needed.
- **Book and resource recommendations** tailored to emotional trends and needs.
- **Clinical progress reports** to aid therapist follow-ups (only with consent).

## Core Use Cases
### For Patients (Women & Youth)
- Join anonymously and begin journaling without mandatory identity disclosure.
- Use the AI assistant for emotional check-ins and reflective conversation.
- Track moods and emotional trends through dashboards and reports.
- Book professional sessions and share relevant insights when ready.
- Access personalized wellness recommendations (yoga, breathing, reading).
- Reach emergency contacts or safety resources if emotional risk is detected.

### For Mental Health Professionals
- View consent-based reports and emotional trend summaries.
- Track pre- and post-therapy changes for better treatment planning.
- Manage schedules, appointments, and patient progress in a dashboard.

### For Anonymous Community Members
- Participate in moderated, stigma-free community circles.
- Share experiences with peers facing similar challenges.
- Maintain privacy while finding support and validation.

## Clinical Significance & Safety
Aurova is designed to assist—not replace—clinical care. The platform focuses on early emotional expression, safe AI guidance, and responsible escalation when risk is detected. Journals and AI insights become clinically meaningful only when the user explicitly grants access to a professional.

## System Architecture
**High-level flow:**
1. User actions (journaling, chatbot, scheduling) are submitted from the React UI.
2. Node.js + Express APIs handle authentication, consent checks, and orchestration.
3. AI services analyze text for sentiment, emotion, and safety indicators.
4. MongoDB stores journals, reports, appointments, and consent settings.
5. Results are returned to the frontend dashboards for users or doctors.

**Core components:**
- **Frontend:** Patient and doctor portals with separate dashboards.
- **Backend:** REST APIs for authentication, journals, reports, and scheduling.
- **AI Services:** LLM-based assistant plus emotion/sentiment analysis.
- **Database:** MongoDB collections for users, journals, reports, and therapy sessions.
- **Cloud-ready:** Designed for deployment on AWS or similar infrastructure.

![Aurova architecture diagram](https://github.com/user-attachments/assets/7484e760-980f-4b3e-9f24-9d2a0299a1f1)

## Technology Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (cloud-ready)
- **AI/ML:** Google Gemini + NLP/Sentiment analysis pipelines
- **Auth:** Firebase Authentication + JWT
- **Visualization:** Recharts dashboards

## Tech Stack Icons
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=000)
![Google%20Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=fff)

## Module Overview
- **User Management & Consent** – anonymous access and privacy controls.
- **Journaling & Emotional Check-ins** – daily reflection and therapy logs.
- **AI Emotion Analysis** – sentiment detection and trend reporting.
- **Chatbot Support** – empathetic AI conversation and coping prompts.
- **Therapy Scheduling** – appointment booking and reminders.
- **Doctor Dashboard** – reports, trends, and feedback workflows.
- **Reporting & Analytics** – weekly summaries, progress comparisons.
- **Safety & Alerting** – threat detection for self-harm indicators.
- **Community Support** – peer groups with moderated privacy.
- **Personalized Recommendations** – yoga, wellness routines, book suggestions.

## Project Structure
```
.
├── components/      # Reusable UI components
├── views/           # Screen-level views (journal, community, dashboards)
├── services/        # API/client helpers
├── server/          # Express backend + AI orchestration
├── App.tsx          # Frontend entry point
└── Images/          # Sample UI screenshots
```

## Screenshots
![Landing page](Images/WhatsApp%20Image%202026-01-30%20at%2010.39.42%20PM.jpeg)
![Journal & chat experience](Images/WhatsApp%20Image%202026-01-30%20at%2010.40.04%20PM.jpeg)
![Dashboard views](Images/WhatsApp%20Image%202026-01-30%20at%2010.42.04%20PM.jpeg)
![Community & wellness hub](Images/WhatsApp%20Image%202026-01-30%20at%2010.42.28%20PM.jpeg)
![Circle support hub](https://github.com/user-attachments/assets/8b5081e8-5ff2-4bf2-b207-dee1323dafa2)
![Guided wellness cards](Images/WhatsApp%20Image%202026-01-30%20at%2010.40.25%20PM.jpeg)
![Expert guidance frame](Images/WhatsApp%20Image%202026-01-30%20at%2010.40.40%20PM.jpeg)
![Mood tracking frame](Images/WhatsApp%20Image%202026-01-30%20at%2010.41.28%20PM.jpeg)
![Reports snapshot](Images/WhatsApp%20Image%202026-01-30%20at%2010.41.45%20PM.jpeg)
![Doctor dashboard frame](Images/WhatsApp%20Image%202026-01-30%20at%2010.42.19%20PM.jpeg)
![Wellness recommendations](Images/WhatsApp%20Image%202026-01-30%20at%2010.42.57%20PM.jpeg)

## Getting Started
### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Google Gemini API key
- Firebase project

### Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Configure Environment
Create a `.env` file in `server/` with (use either `FIREBASE_SERVICE_ACCOUNT` or a file path):
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/firebase-service-account.json
```

### Run Locally
```bash
# Terminal 1: Backend
cd server
node index.js

# Terminal 2: Frontend
cd ..
npm run dev
```

## Contributors
- me
- [@sanhithaac](https://github.com/sanhithaac)
