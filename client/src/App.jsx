import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResumeBuilder from './pages/ResumeBuilder'
import SavedResumes from './pages/SavedResumes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeBuilder />} />
        <Route path="/saved" element={<SavedResumes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
