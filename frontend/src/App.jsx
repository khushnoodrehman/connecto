import Signup from "./pages/Signup/Signup.jsx"
import Login from "./pages/Login/Login.jsx"
import Feed from "./pages/Feed/Feed.jsx"
import Layout from "./components/Layouts/Layout.jsx"
import Friends from "./pages/Friends/Friends.jsx"
import Profile from "./pages/Profile/Profile.jsx"
import Saved from "./pages/Saved/Saved.jsx"
import { AuthProvider } from "./providers/AuthContext.jsx"
import { PostProvider } from "./providers/PostContext.jsx"
import { FriendProvider } from "./providers/FriendContext.jsx"
import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Navigate } from 'react-router-dom'


function App() {

  return (
    <div className="App">
      <AuthProvider>
        <PostProvider>
          <FriendProvider>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route element={<Layout />}>
                <Route path="feed" element={<Feed />} />
                <Route path="friends" element={<Friends />} />
                <Route path="profile/:id" element={<Profile />} />
                <Route path="saved" element={<Saved />} />
              </Route>
            </Routes>
          </FriendProvider>
        </PostProvider>
      </AuthProvider>
    </div>
  )
}

export default App
