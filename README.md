# InterviewPro AI

**InterviewPro AI** is a full-stack web application built with **MERN (MongoDB, Express, React, Node.js)**, **Vite**, and **Tailwind CSS**. It provides users with a platform for **mock interviews, coding practice, question banks, and analytics** to prepare for technical interviews.

**Live Demo:** [https://interviewpro-ai.onrender.com](https://interviewpro-ai.onrender.com)

---

## Features

* **User Authentication:** Register, login, and secure access to dashboard pages.
* **Private Routes:** Only logged-in users can access dashboard, mock interviews, coding practice, and analytics pages.
* **Mock Interview:** Practice interview questions interactively.
* **Question Bank:** Browse and search coding and technical questions.
* **Coding Practice:** Solve coding challenges with instant feedback.
* **Analytics Dashboard:** Track performance and progress over time.
* **Responsive Design:** Mobile-first UI using Tailwind CSS.

---

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, React Router, Lucide Icons
* **Backend:** Node.js, Express, MongoDB (via Mongoose)
* **Authentication:** JWT-based authentication
* **Deployment:** Render (frontend + backend)

---

## Project Structure

```
interviewpro-ai/
│
├─ frontend/               
│  ├─ src/
│  │  ├─ components/       # Navbar, reusable UI components
│  │  ├─ context/          # AuthContext for user authentication
│  │  ├─ pages/            # Login, Register, Dashboard, etc.
│  │  ├─ utils/            # API configuration (axios)
│  │  └─ App.jsx           # Routes and PrivateRoute
│  └─ package.json
│
├─ backend/                
│  ├─ models/              # Mongoose models (User, Question, etc.)
│  ├─ routes/              # Express routes (auth, questions, analytics)
│  ├─ controllers/         # Request handlers
│  ├─ middleware/          # Custom middleware for authentication, error handling, etc.
│  ├─ seeder.js            # Database seeding script
│  └─ server.js            # Main Express server
│
└─ README.md
```

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/interviewpro-ai.git
cd interviewpro-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

* Create a `.env` file:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

* Run the backend:

```bash
npm run dev
```

Backend will run at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

* Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

* Run the frontend:

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Deployment on Render

* **Frontend:** Connect your GitHub repo → Select frontend folder → Set:

  * **Build Command:** `npm install && npm run build`
  * **Publish Directory:** `dist`

* **Backend:** Connect your GitHub repo → Set:

  * **Build Command:** `npm install`
  * **Start Command:** `node server.js`
  * **Environment Variables:** MongoDB URI, JWT Secret

---

## Usage

1. Open the app in the browser.
2. Register a new account or login.
3. Navigate through the dashboard, mock interviews, coding practice, and analytics.
4. Click **Logout** to safely end the session.

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push branch: `git push origin feature/YourFeature`
5. Open a Pull Request

