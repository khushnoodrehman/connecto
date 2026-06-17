# Connecto

Connecto is a modern, responsive, and feature-rich social media platform that allows users to share posts, interact with friends, save articles, customize profiles, and message each other. Built on the MERN stack (MongoDB, Express, React, Node.js), it offers a premium user interface and seamless user experience.

---

## 🚀 Key Features

*   **User Authentication**: Safe and secure signup/login handled via Passport.js and express-sessions.
*   **Dynamic Social Feed**: View posts shared by the community, complete with image uploads, likes count, and comment threads.
*   **Post Interactions**:
    *   **Like/Unlike**: Express appreciation on posts.
    *   **Comments**: Engage in discussions on post comments sections.
    *   **Save/Bookmark**: Toggle post bookmarking to view later in your saved feed.
*   **Friendship Management System**:
    *   Send and cancel friend requests.
    *   Accept or decline incoming requests.
    *   Discover new contacts through automated user suggestions.
    *   View your lists of accepted friends.
*   **Profile Customization**:
    *   Edit display names, bio, birthday, and relationship status.
    *   Upload profile avatar and cover background photo directly to Cloudinary.
    *   Link social media handles (Instagram, TikTok, YouTube, X).
    *   Review past posts, photos uploaded, and friends list.
*   **Dynamic Search**: Filter and search users by name in real-time.
*   **Bookmarks Hub**: A dedicated `/saved` page showing all bookmarked posts with full like/comment options.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (Vite builder)
*   **Styling**: Vanilla CSS, React Bootstrap, Material-UI (MUI Icons)
*   **Routing**: React Router DOM (v6)
*   **Date Formatting**: `date-fns`
*   **State Management**: React Context API (Auth, Friends, and Post providers)

### Backend & Database
*   **Runtime**: Node.js & Express
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: Passport.js with Local Strategy (`passport-local-mongoose`)
*   **File Uploads**: Multer & Cloudinary (`multer-storage-cloudinary`)
*   **Utilities**: `dotenv` for env configuration, `method-override`

---

## 📦 Project Setup

### Prerequisites
Before you start, ensure you have:
*   [Node.js](https://nodejs.org/) installed
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 1. Repository Installation
Clone this repository to your local system:
```bash
git clone https://github.com/khushnoodrehman/connecto.git
cd connecto
```

### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your Cloudinary configurations:
   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   ```
4. Seed mock database users (optional, to test friend requests and suggestions):
   ```bash
   node seedUsers.js
   ```
5. Start the server:
   ```bash
   node server.js
   # Or using nodemon (if installed globally)
   npx nodemon server.js
   ```
   The backend will run on `http://localhost:8080`.

### 3. Frontend Configuration
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`.

---

## 📁 Project Structure

```
connecto/
├── backend/
│   ├── cloudConfig.js       # Cloudinary setup for upload storage
│   ├── models/              # Mongoose DB schemas (User, Post, Like, Comment, Friend)
│   ├── seedUsers.js         # Initial dummy users database seeder
│   ├── server.js            # Express application routes and server config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Common UI elements (Navigation, Sidebars, RightBar, Layouts)
│   │   ├── pages/           # Pages (Feed, Profile, Friends, Saved, Login, Signup)
│   │   ├── providers/       # Context APIs (AuthContext, FriendContext, PostContext)
│   │   ├── App.jsx          # Route configuration
│   │   └── main.jsx         # App entry point
│   └── package.json
└── README.md
```

---

## 📝 License
This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
