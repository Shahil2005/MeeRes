import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder'
import SavedResumes from './pages/SavedResumes'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeBuilder />} />
        <Route path="/saved" element={<SavedResumes />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
